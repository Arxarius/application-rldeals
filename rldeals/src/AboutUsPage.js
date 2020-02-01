import React, {Component} from 'react';

class AboutUsPage extends Component {
    render() {
        return (
            <div style={{backgroundColor: 'white', padding: 20}}>
                <h2 style={{color: 'black'}}>
                    About us
                </h2>
                <p style={{color: 'black', fontWeight: 300}}>
                    The RL.DEALS team consists of talented Rocket League enthusiasts from all walks of life.
                    The one thing we all have in common is that we love Rocket League trading and have a passion to push
                    the boundaries.
                    We’ve been working for an extremely long time to provide a safe, reliable and automated trading
                    system that works around the clock to ensure users have the most convenient trading experience,
                    without the need to worry about scams or not receiving their fair end of the deal.
                    If you have any business inquiries, please contact us at support@rl.deals. General questions that
                    can’t be answered in our FAQ can be answered on <a href="https://discord.gg/4bNYPTE"
                                                                       rel="noopener noreferrer"
                                                                       target="_blank">Discord</a>.
                </p>
                <p style={{color: 'black', fontWeight: 300}}>
                    Website: <a href="https://rl.deals/">https://rl.deals/</a>
                </p>
                <p style={{color: 'black', fontWeight: 300}}>
                    Bot Account (Steam): <a
                    href="https://steamcommunity.com/profiles/76561198143743447/">https://steamcommunity.com/profiles/76561198143743447/</a>
                </p>
                <p style={{color: 'black', fontWeight: 300}}>
                    For questions visit our <a href="#faq">FAQ</a> or join our <a href="https://discord.gg/4bNYPTE"
                                                                                  rel="noopener noreferrer"
                                                                                  target="_blank">Discord server</a>
                </p>
            </div>
        );
    }
}

export default AboutUsPage;