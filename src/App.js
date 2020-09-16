import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {
  Switch,
  HashRouter,

  Route
} from "react-router-dom";

import './i18n';
import interestTheme from './theme';

import Account from './components/account';
import Footer from './components/footer';
import Foot from './components/foot';
import Head from './components/head';
import Home from './components/home';
import HomeTemp from './views/home';
import Stake from './components/stake';
import RewardsPools from './components/rewardPools';
import Header from './components/header';
import Calc from './components/calc';
// import Propose from './components/propose';
import Claim from './components/claim';
import Vote from './components/vote';
import './App.css'

import {
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  CONFIGURE,
  CONFIGURE_RETURNED,
  GET_BALANCES_PERPETUAL,
  GET_BALANCES_PERPETUAL_RETURNED
} from './constants'

import { injected } from "./stores/connectors";

import Store from "./stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class App extends Component {
  state = {
    account: null,
    headerValue: null
  };

  setHeaderValue = (newValue) => {
    this.setState({ headerValue: newValue })
  };

  componentWillMount() {
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(CONFIGURE_RETURNED, this.configureReturned);
    emitter.on(GET_BALANCES_PERPETUAL_RETURNED, this.getBalancesReturned);

    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        injected.activate()
          .then((a) => {
            store.setStore({ account: { address: a.account }, web3context: { library: { provider: a.provider } } })
            emitter.emit(CONNECTION_CONNECTED)
            // console.log(a)
          })
          .catch((e) => {
            // console.log(e)
          })
      } else {

      }
    });
  }

  componentWillUnmount() {
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(CONFIGURE_RETURNED, this.configureReturned);
    emitter.removeListener(GET_BALANCES_PERPETUAL_RETURNED, this.getBalancesReturned);
  };

  getBalancesReturned = () => {
    window.setTimeout(() => {
      dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} })
    }, 15000)
  }

  configureReturned = () => {
    dispatcher.dispatch({ type: GET_BALANCES_PERPETUAL, content: {} })
  }

  connectionConnected = () => {
    this.setState({ account: store.getStore('account') })
    dispatcher.dispatch({ type: CONFIGURE, content: {} })
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

  render() {

    const { headerValue, account } = this.state

    return (
      <MuiThemeProvider theme={createMuiTheme(interestTheme)}>
        <CssBaseline />
        <HashRouter>
          {!account &&
            <div style={{
              // display: 'flex',
              flexDirection: 'column',
              minHeight: '969px',
              minWidth: '100vw',
              justifyContent: 'center',
              alignItems: 'center',
              background: "#f9fafb"
            }}>
              <Account />
            </div>
          }
          {account &&
            <div style={{
              // display: 'flex',
              flexDirection: 'column',
              minHeight: '969px',
              justifyContent: 'center',
              alignItems: 'center',
              background: "#f9fafb"
            }}>
              <Switch>
                <Route path="/stake">
                  {/* <Footer /> */}
                  <Head/>
                  <Stake />
                  <Foot/>
                </Route>
                <Route path="/staking">
                  {/* <Footer /> */}
                  <Head/>
                  <RewardsPools />
                  <Calc/>
                  <Foot/>
                </Route>
                <Route path="/vote">
                  {/* <Footer /> */}
                  <Vote />
                </Route>
                {/*<Route path="/claim">
                  <Footer />
                  <Claim />
                </Route>*/}
                <Route path="/">
                  {/* <Home /> */}
                  {/* <Account /> */}
                  <HomeTemp />
                </Route>
              </Switch>
            </div>
          }
        </HashRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
