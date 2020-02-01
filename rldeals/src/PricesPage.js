/* eslint-disable */
import React, { Component } from "react";
import Api from "./Api";
import Utils from "./Utils";
import {
  Modal,
  Button,
  Container,
  Col,
  Row,
  Table,
  Form
} from "react-bootstrap";
import "react-table/react-table.css";
import ReactTable from "react-table";

class PricesPage extends Component {
  constructor() {
    super();
    this.state = {
      prices: [],
      modifiedPrices: [],
      lastModified: 0,
      inventoryCount: 0,
      submitDialogOpen: false,
      bulkEditProperty: "overwriteLowPrice"
    };
    this.renderEditable = this.renderEditable.bind(this);
  }

  renderEditable(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.prices];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ data });
          console.log(data);
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.prices[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }

  componentDidMount() {
    this.getPrices();
  }

  getPrices = () => {
    Api.GetPrices(
      prices => {
        let sortedPrices = prices.sort((a, b) => {
          let dateA = new Date(a.modifiedAt || a.createdAt).getTime();
          let dateB = new Date(b.modifiedAt || b.createdAt).getTime();

          if (dateA < dateB) return 1;
          else if (dateA > dateB) return -1;
          else return 0;
        });

        let lastModified = sortedPrices[0]
          ? new Date(
              sortedPrices[0].modifiedAt || sortedPrices[0].createdAt
            ).getTime()
          : 0;
        this.setState({
          prices: sortedPrices,
          lastModified
        });
      },
      error => {
        console.error(error);
        this.props.openNotification("error", "Failed to retrieve prices");
      }
    );
  };

  updatePrices = toBeUpdatedPrices => {
    let { prices, modifiedPrices } = this.state;

    let newPrices = prices;
    let newModifiedPrices = modifiedPrices;

    for (let toBeUpdatedPrice of toBeUpdatedPrices) {
      let existingPriceIndex = newPrices.findIndex(
        _ => _.product.uniqueKey === toBeUpdatedPrice.product.uniqueKey
      );

      if (existingPriceIndex >= 0) {
        if (!Utils.isEqual(newPrices[existingPriceIndex], toBeUpdatedPrice)) {
          let now = new Date().toISOString();
          if (!now.endsWith("Z")) now += "Z";
          toBeUpdatedPrice.modifiedAt = now;
          newPrices[existingPriceIndex] = toBeUpdatedPrice;
          newModifiedPrices = newModifiedPrices
            .filter(
              _ => _.product.uniqueKey !== toBeUpdatedPrice.product.uniqueKey
            )
            .concat([toBeUpdatedPrice]);
        }
      } else {
        newPrices.push(toBeUpdatedPrice);
        newModifiedPrices.push(toBeUpdatedPrice);
      }
    }

    // if (query && price.product.name.toUpperCase().indexOf(query) < 0)
    //   return false;

    saveNewPrices = () => {
      Api.SavePrices(
        this.state.modifiedPrices,
        () => {
          this.setState({
            modifiedPrices: []
          });
          this.props.openNotification(
            "success",
            "Successfully submitted prices"
          );
        },
        error => {
          console.error(error);
          this.props.openNotification("error", "Price submission failed");
        }
      );
    };

    bulkEdit = prices => {
      let value = this.state.bulkEditValue;
      let property = this.state.bulkEditProperty;
      if (property === "highPriceConfiguration") {
        // Keep as text
      } else if (property === "disabled") {
        value = value === "true";
      } else if (property.endsWith("X") || property.endsWith("Limit")) {
        value = parseInt(value) || null;
      } else {
        value = parseFloat(value) || null;
      }

      let newPrices = [];
      for (let price of prices) {
        let newPrice = {
          ...price
        };
        newPrice[property] = value;
        newPrices.push(newPrice);
      }
      this.updatePrices(newPrices);
    };

    handleSort = id => {
      this.setState(prev => {
        return {
          [id]: !prev[id],
          prices: prev.prices.sort((a, b) =>
            prev[id] ? a[id] < b[id] : a[id] > b[id]
          )
        };
      });
    };
  };

  calculateExamplePrice = price => {
    const { inventoryCount } = this.props;
    const lowPrice =
      price.overwriteLowPrice != null
        ? price.overwriteLowPrice
        : price.insiderLowPrice;
    const highPrice =
      price.overwriteHighPrice != null
        ? price.overwriteHighPrice
        : price.insiderHighPrice;
    const x = price.overwriteX != null ? price.overwriteX : price.presetX;
    const step = price.overwriteStep ? price.overwriteStep : price.presetStep;
    const steps = Math.floor(inventoryCount / x);
    let finalPrice = highPrice - steps * step;
    finalPrice = Math.max(0, lowPrice, finalPrice);
    console.log(finalPrice);
    return Utils.roundNumber(finalPrice, 4);
  };

  render() {
    let {
      prices,
      lastModified,
      minValue,
      maxValue,
      query,
      submitDialogOpen
    } = this.state;

    prices = prices.filter(price => {
      let lowPrice =
        price.overwriteLowPrice != null
          ? price.overwriteLowPrice
          : price.insiderLowPrice;
      if (!isNaN(minValue) && lowPrice < minValue) return false;

      let highPrice =
        price.overwriteHighPrice != null
          ? price.overwriteHighPrice
          : price.insiderHighPrice;
      if (!isNaN(maxValue) && highPrice > maxValue) return false;

      if (
        query &&
        price.product.definition.name.toUpperCase().indexOf(query) < 0
      )
        return false;

      return true;
    });

    const dataArray = [];

    prices.map(price => {
      const priceLastModifiedAt = new Date(price.modifiedAt || price.createdAt);
      const product = price.name;
      let fullName = product;
      let active = "";

      fullName += ` - ${price.paint}`;
      if (price.specialEdition != "None") {
        fullName += ` - ${price.specialEdition}`;
      }

      price.disable != "true" ? (active = "No") : (active = "Yes");

      const examplePrice = this.calculateExamplePrice(price);

      dataArray.push({
        lastupdated: Utils.serializeDate(priceLastModifiedAt),
        name: fullName,
        insiderLowPrice: price.insiderLowPrice,
        insiderHighPrice: price.insiderHighPrice,
        presetLimit: price.presetLimit,
        presetMargin: price.presetMargin,
        presetStep: price.presetStep,
        presetX: price.presetX,
        disabled: active,
        priceconf: price.highPriceConfiguration,
        exampleprice: examplePrice
      });
    });

    const data = dataArray;

    const columns = [
      {
        Header: "Last updated",
        accessor: "lastupdated"
      },
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Insider Low Price",
        accessor: "insiderLowPrice",
        Cell: this.renderEditable
      },
      {
        Header: "Insider High Price",
        accessor: "insiderHighPrice",
        Cell: this.renderEditable
      },
      {
        Header: "Preset Limit",
        accessor: "presetLimit",
        Cell: this.renderEditable
      },
      {
        Header: "Preset margin",
        accessor: "presetMargin",
        Cell: this.renderEditable
      },
      {
        Header: "Preset Step",
        accessor: "presetStep",
        Cell: this.renderEditable
      },
      {
        Header: "Preset 'X'",
        accessor: "presetX",
        Cell: this.renderEditable
      },
      {
        Header: "Disabled?",
        accessor: "disabled",
        Cell: this.renderEditable
      },
      {
        Header: "Price Conf",
        accessor: "priceconf"
      },
      {
        Header: "Example Price",
        accessor: "exampleprice"
      }
    ];

    return (
      <Container fluid={true}>
        <Row
          style={{
            background: "#fff",
            color: "black",
            paddingTop: "15px"
          }}
        >
          <Col>
            <h5 className="text-dark"> Item Pricing Table </h5>{" "}
            <small className="text-muted">
              Edit RL DEALS pricing / Use the filtering options below to find an
              individual or group of items{" "}
            </small>{" "}
          </Col>{" "}
          <Col>
            <Button
              className="pull-right"
              variant="primary"
              onClick={() =>
                this.setState({
                  submitDialogOpen: true
                })
              }
            >
              {" "}
              Submit prices{" "}
            </Button>{" "}
          </Col>{" "}
          <Col xs={12}>
            <hr />
          </Col>{" "}
        </Row>{" "}
        <Row
          style={{
            background: "#fff",
            color: "black",
            paddingTop: "15px"
          }}
        >
          <Col xs={2}>
            <Form>
              <Form.Group controlId="pricesInventoryCount">
                <Form.Label>Example price inventory count</Form.Label>
                <Form.Control
                  name="inventory-count"
                  type="number"
                  defaultValue={0}
                  onChange={event =>
                    this.setState({
                      inventoryCount: parseInt(event.target.value)
                    })
                  }
                />
                <Form.Text className="text-muted">
                  Example price inventory count
                </Form.Text>
              </Form.Group>
            </Form>
          </Col>
          <Col xs={6}>
            <Form>
              <Form.Group controlId="priceBulkEdit">
                <Form.Label> Bulk edit </Form.Label>{" "}
                <Row>
                  <Col>
                    <Form.Control
                      as="select"
                      onChange={event =>
                        this.setState({
                          bulkEditProperty: event.target.value
                        })
                      }
                    >
                      <option value="overwriteLowPrice">
                        {" "}
                        overwriteLowPrice{" "}
                      </option>{" "}
                      <option value="overwriteHighPrice">
                        {" "}
                        overwriteHighPrice{" "}
                      </option>{" "}
                      <option value="overwriteLimit">
                        {" "}
                        overwriteLimit{" "}
                      </option>{" "}
                      <option value="overwriteMargin">
                        {" "}
                        overwriteMargin{" "}
                      </option>{" "}
                      <option value="overwriteStep">
                        {" "}
                        overwriteStep{" "}
                      </option>{" "}
                      <option value="overwriteX"> overwriteX </option>{" "}
                      <option value="highPriceConfiguration">
                        {" "}
                        highPriceConfiguration{" "}
                      </option>{" "}
                      <option value="disabled"> disabled </option>{" "}
                    </Form.Control>{" "}
                  </Col>{" "}
                  <Col>
                    <Form.Control
                      placeholder="Your Value"
                      onChange={event =>
                        this.setState({
                          bulkEditValue: event.target.value
                        })
                      }
                    />{" "}
                  </Col>{" "}
                  <Col>
                    <Button
                      variant="primary"
                      onClick={() => this.bulkEdit(prices)}
                    >
                      {" "}
                      Bulk edit visible rows{" "}
                    </Button>{" "}
                  </Col>{" "}
                </Row>{" "}
                <Form.Text className="text-muted">
                  Bulk edit all visible rows in hte table below(1. Select your
                  column to edit, 2. enter the bulk value, 3. submit){" "}
                </Form.Text>{" "}
              </Form.Group>{" "}
            </Form>{" "}
          </Col>
        </Row>{" "}
        <Row
          style={{
            background: "#fff",
            color: "black"
          }}
        >
          <Col>
            <div
              style={{
                display: submitDialogOpen ? "block" : "none"
              }}
            >
              <Modal
                show={submitDialogOpen}
                onHide={() =>
                  this.setState({
                    submitDialogOpen: false
                  })
                }
              >
                <Modal.Header closeButton>
                  <Modal.Title> Confirmation dialog </Modal.Title>{" "}
                </Modal.Header>{" "}
                <Modal.Body>
                  {" "}
                  Are you sure you want to submit prices ?{" "}
                </Modal.Body>{" "}
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      this.setState({
                        submitDialogOpen: false
                      })
                    }
                  >
                    Close{" "}
                  </Button>{" "}
                  <Button variant="primary" onClick={this.saveNewPrices}>
                    Save Changes{" "}
                  </Button>{" "}
                </Modal.Footer>{" "}
              </Modal>{" "}
            </div>{" "}
          </Col>{" "}
        </Row>{" "}
        <Row
          style={{
            background: "#fff",
            color: "black",
            paddingTop: "15px"
          }}
        >
          <Col>
            <small
              style={{
                color: "black"
              }}
            >
              Refine your search to see more prices{" "}
            </small>{" "}
          </Col>{" "}
        </Row>{" "}
        <Row
          style={{
            background: "#fff",
            color: "black"
          }}
        >
          <Col>
            <ReactTable data={data} columns={columns} filterable={true} />
          </Col>
        </Row>
        <Row
          style={{
            background: "#fff",
            color: "black"
          }}
        >
          <Col />
        </Row>
      </Container>
    );
  }
}

export default PricesPage;
