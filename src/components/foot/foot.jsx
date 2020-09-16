import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { withNamespaces } from 'react-i18next';
import i18n from '../../i18n';
import { colors } from '../../theme'
import './foot.scss'
import Store from "../../stores";
import logo from '../../assets/images/home/home_logo.png'
import linkOne from '../../assets/images/footer_link_1.png'
import linkTwo from '../../assets/images/footer_link_2.png'
import linkThree from '../../assets/images/footer_link_3.png'
import linkFour from '../../assets/images/footer_link_4.png'
import Link from '@material-ui/core/Link';
const store = Store.store

class Footer extends Component {

  constructor(props) {
    super()

    this.state = {
      open: true,
      anchorEl: null
    }
  }

  render() {
    const { classes, t, location } = this.props;
    const { open, anchorEl, language } = this.state

    return (
      <div className="foot">
        <div className="container-fluid">
          <div className="container">
            <div>
              <div>
                <Link href="/"><img src={logo} /></Link>
              </div>
              <div>
                <div className="doc-link"><Link href={(i18n.language === 'zh' || i18n.language === 'zh-CN') ? "https://docs.qq.com/doc/DUnVXcFh3a0JwdGdN?pub=1&dver=2.1.0" : "https://yfii.s3-ap-northeast-1.amazonaws.com/YFII_Innovative_DeFi_Yield_Farming_Token.pdf"} target="_blank">{t('Stake.Title')}</Link></div>
              </div>
            </div>
            <div>
              {/* <a href="https://github.com/yfxi" target="_blank"><img src={linkOne} alt=""/></a> */}
              <a href="https://twitter.com/DfiMoney" target="_blank"><img src={linkTwo} alt=""/></a>
              <a href="https://t.me/yfiifinance" target="_blank"><img src={linkThree} alt=""/></a>
              <a href="https://discord.gg/99RJMEU" target="_blank"><img src={linkFour} alt=""/></a>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="container">Copyright 2020 YfXi Team. All rights reserved.</div>
        </div>
      </div>
    )
  }
}

export default withNamespaces()(withRouter((Footer)));
