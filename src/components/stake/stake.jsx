// import React, { Component, useState } from "react";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  // Card,
  TextField,
  InputAdornment
} from '@material-ui/core';
// import Link from '@material-ui/core/Link';
import Popover from '@material-ui/core/Popover';

// import moment from 'moment';

import { withNamespaces } from 'react-i18next';

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import Loader from '../loader'
import Snackbar from '../snackbar'

import Store from "../../stores";
import { colors } from '../../theme'
import './stake.scss'

import {
  ERROR,
  // CONFIGURE_RETURNED,
  STAKE,
  STAKE_RETURNED,
  WITHDRAW,
  WITHDRAW_RETURNED,
  GET_REWARDS,
  GET_REWARDS_RETURNED,
  EXIT,
  EXIT_RETURNED,
  GET_YCRV_REQUIREMENTS,
  GET_YCRV_REQUIREMENTS_RETURNED,
  GET_BALANCES_RETURNED
} from '../../constants'

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '900px',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '400px'
  },
  introCenter: {
    minWidth: '100%',
    textAlign: 'center',
    padding: '48px 0px'
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    minWidth: '100%',
    [theme.breakpoints.up('md')]: {
      minWidth: '800px',
    }
  },
  connectContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '450',
    }
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    marginBottom: '24px',
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid ' + colors.borderBlue,
    alignItems: 'center',
    maxWidth: '500px',
    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  title: {
    padding: '12px',
    textAlign: 'center'
  },
  subtitle: {
    padding: '12px',
    borderRadius: '0.75rem',
    textAlign: 'center'
  },
  walletAddress: {
    padding: '0px 12px'
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray
  },
  overview: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid ' + colors.borderBlue,
    alignItems: 'center',
    marginTop: '40px',
    width: '100%',
    background: colors.white
  },
  overviewField: {
    display: 'flex',
    flexDirection: 'column'
  },
  overviewTitle: {
    color: colors.darkGray
  },
  overviewValue: {

  },
  halfTime: {
    color: colors.red
  },
  actions: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '900px',
    flexWrap: 'wrap',
    background: colors.white,
    border: '1px solid ' + colors.borderBlue,
    padding: '28px 30px',
    borderRadius: '50px',
    marginTop: '40px'
  },
  actionContainer: {
    minWidth: 'calc(50% - 40px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px'
  },
  primaryButton: {
    '&:hover': {
      backgroundColor: "#2F80ED",
    },
    padding: '20px 32px',
    backgroundColor: "#2F80ED",
    borderRadius: '50px',
    fontWeight: 500,
  },
  actionButton: {
    padding: '20px 32px',
    borderRadius: '50px',
  },
  buttonText: {
    fontWeight: '700',
  },
  stakeButtonText: {
    fontWeight: '700',
    color: 'white',
  },
  valContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  inputAdornment: {
    fontWeight: '600',
    fontSize: '1.5rem'
  },
  assetIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '25px',
    background: '#dedede',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    marginRight: '16px'
  },
  balances: {
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer'
  },
  stakeTitle: {
    width: '100%',
    color: colors.darkGray,
    marginBottom: '20px'
  },
  stakeButtons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    align: 'center',
    marginTop: '20px'
  },
  stakeButton: {
    minWidth: '300px'
  },
  requirement: {
    display: 'flex',
    alignItems: 'center'
  },
  check: {
    paddingTop: '6px'
  },
  voteLockMessage: {
    margin: '20px'
  }
})

const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

class Stake extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    const pool = store.getStore('currentPool')

    // if(!pool) {
    //   props.history.push('/')
    // }

    this.state = {
      pool: pool,
      loading: !(account || pool),
      account: account,
      value: 'options',
      voteLockValid: false,
      balanceValid: false,
      voteLock: null,
      open: true,
      showStake: true,
      showUnStake: true,
      anchorEl: null
    }

    if (pool && ['Governance V2'].includes(pool.id)) {
      dispatcher.dispatch({ type: GET_YCRV_REQUIREMENTS, content: {} })
    }
  }

  componentDidMount() {
    this._countDown();
  }

  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(STAKE_RETURNED, this.showHash);
    emitter.on(WITHDRAW_RETURNED, this.showHash);
    emitter.on(EXIT_RETURNED, this.showHash);
    emitter.on(GET_REWARDS_RETURNED, this.showHash);
    emitter.on(GET_YCRV_REQUIREMENTS_RETURNED, this.yCrvRequirementsReturned);
    emitter.on(GET_BALANCES_RETURNED, this.balancesReturned);
  }

  componentWillUnmount() {
    clearTimeout(this.time);
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(STAKE_RETURNED, this.showHash);
    emitter.removeListener(WITHDRAW_RETURNED, this.showHash);
    emitter.removeListener(EXIT_RETURNED, this.showHash);
    emitter.removeListener(GET_REWARDS_RETURNED, this.showHash);
    emitter.removeListener(GET_YCRV_REQUIREMENTS_RETURNED, this.yCrvRequirementsReturned);
    emitter.removeListener(GET_BALANCES_RETURNED, this.balancesReturned);
  };

  _countDown = () => {
    const currTime = new Date().getTime();
    const deadline = this.state.pool ? this.state.pool.tokens[0].halfTime : 0;
    const dTime = deadline - currTime;
    if (dTime <= 0) {
      // 这样做更精确
      clearTimeout(this.time);
      this.setState({
        day: '00',
        hours: '00',
        minutes: '00',
        seconds: '00'
      });
      return;
    }
    this.time = setTimeout(() => {
      this.setState(this._formatTime(dTime));
      this._countDown();
    }, 1000);
  }

  _formatTime = time => {
    const day = Math.floor(time / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
    const minutes = Math.floor((time / (1000 * 60)) % 60).toString().padStart(2, '0');
    const seconds = Math.floor((time / 1000) % 60).toString().padStart(2, '0');
    // const milliseconds = Math.floor(time % 1000);
    return ({ day, hours, minutes, seconds });
  }

  balancesReturned = () => {
    const currentPool = store.getStore('currentPool')
    const pools = store.getStore('rewardPools')
    let newPool = pools.filter((pool) => {
      return pool.id === currentPool.id
    })

    if (newPool.length > 0) {
      newPool = newPool[0]
      store.setStore({ currentPool: newPool })
    }
  }

  yCrvRequirementsReturned = (requirements) => {
    this.setState({
      balanceValid: requirements.balanceValid,
      voteLockValid: requirements.voteLockValid,
      voteLock: requirements.voteLock
    })
  }

  showHash = (txHash) => {
    this.setState({ snackbarMessage: null, snackbarType: null, loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  render() {
    // const { classes, t, i18n } = this.props;
    const { classes, t } = this.props;
    const {
      value,
      account,
      // modalOpen,
      pool,
      loading,
      snackbarMessage,
      voteLockValid,
      balanceValid,
      day, hours, minutes, seconds,
      // showStake,showUnStake
    } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0, 6) + '...' + account.address.substring(account.address.length - 4, account.address.length)
    }

    if (!pool) {
      return null
    }

    return (
      <div className={`container-fluid pool-stake`}>
        <div className="container">
          {/* <Typography variant="h2" className={ classes.title }>
          <Link href={(i18n.language=== 'zh' || i18n.language === 'zh-CN')? "https://docs.qq.com/doc/DUnVXcFh3a0JwdGdN?pub=1&dver=2.1.0":"https://yfii.s3-ap-northeast-1.amazonaws.com/YFII_Innovative_DeFi_Yield_Farming_Token.pdf"} target="_blank">{t('Stake.Title')}</Link>
        </Typography>
        {(i18n.language=== 'zh' || i18n.language === 'zh-CN') &&<Typography variant="h3" className={ classes.subtitle }><Link href="https://docs.qq.com/doc/DUnJVU0NXYUhPZVlC?pub=1&dver=2.1.0" target="_blank">{t('Stake.Subtitle')}</Link></Typography>}
        <div className={ classes.intro }>
          <Card className={ classes.addressContainer } onClick={this.overlayClicked}>
            <Typography variant={ 'h3'} className={ classes.walletTitle } noWrap>{t('Stake.Wallet')}</Typography>
            <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap>{ address }</Typography>
            <div style={{ background: '#DC6BE5', opacity: '1', borderRadius: '10px', width: '10px', height: '10px', marginRight: '3px', marginTop:'3px', marginLeft:'6px' }}></div>
          </Card>
        </div> */}
          <div className="stake-title">{t("Stake.Loan")}</div>
          <div className={classes.overview}>
            <div className={classes.overviewField}>
              <Typography variant={'h3'} className={classes.overviewTitle}>{t('Stake.YourBalance')}</Typography>
              <Typography variant={'h2'} className={classes.overviewValue}>{pool.tokens[0].balance ? pool.tokens[0].balance.toFixed(2) : "0"}  {pool.tokens[0].symbol}</Typography>
            </div>
            <div className={classes.overviewField}>
              <Typography variant={'h3'} className={classes.overviewTitle}>{t('Stake.CurrentlyStaked')}</Typography>
              <Typography variant={'h2'} className={classes.overviewValue}>{pool.tokens[0].stakedBalance ? pool.tokens[0].stakedBalance.toFixed(2) : "0"}</Typography>
            </div>
            {!pool.hiddenHalfTime && <div className={classes.overviewField}>
              <Typography variant={'h3'} className={classes.overviewTitle}>{t('Stake.HalfTime')}</Typography>
              <div className="stake-half">
                <div className="half-line"></div>
                <div>
                  <div>{isNaN(day) ? '--' : day}</div>
      <div>{t('Stake.Day')}</div>
                </div>
                <div>
                  <div>{isNaN(hours) ? '--' : hours}</div>
      <div>{t('Stake.Hour')}</div>
                </div>
                <div>
                  <div>{isNaN(minutes) ? '--' : minutes}</div>
      <div>{t('Stake.Minute')}</div>
                </div>
                <div>
                  <div>{isNaN(seconds) ? '--' : seconds}</div>
      <div>{t('Stake.Second')}</div>
                </div>
              </div>
              {/* <Typography variant={ 'h2' } className={ classes.overviewValue }>{isNaN(day)?'--':day}day {isNaN(hours)?'--':hours}:{isNaN(minutes)?'--':minutes}:{isNaN(seconds)?'--':seconds}</Typography> */}
            </div>}
            <div className={classes.overviewField}>
              <Typography variant={'h3'} className={classes.overviewTitle}>{t('Stake.RewardsAvailable')}</Typography>
              <Typography variant={'h2'} className={classes.overviewValue}>{pool.tokens[0].rewardsSymbol == '$' ? pool.tokens[0].rewardsSymbol : ''} {pool.tokens[0].rewardsAvailable ? pool.tokens[0].rewardsAvailable.toFixed(2) : "0"} {pool.tokens[0].rewardsSymbol !== '$' ? pool.tokens[0].rewardsSymbol : ''}</Typography>
            </div>
          </div>
          {pool.id === 'Fee Rewards' &&
            <div className={classes.actions}>
              <Typography className={classes.stakeTitle} variant={'h3'}>{t('Stake.yCRVRewardRequirements')}</Typography>
              <div className={classes.requirement}>
                <Typography variant={'h4'}>{t('Stake.YouMustHaveVoted')}</Typography><Typography variant={'h4'} className={classes.check}>{voteLockValid ? <CheckIcon style={{ color: colors.green }} /> : <ClearIcon style={{ color: colors.red }} />}</Typography>
              </div>
              <div className={classes.requirement}>
                <Typography variant={'h4'}>{t('Stake.YouMustHave')}</Typography><Typography variant={'h4'} className={classes.check}>{balanceValid ? <CheckIcon style={{ color: colors.green }} /> : <ClearIcon style={{ color: colors.red }} />}</Typography>
              </div>
            </div>
          }
          {value === 'options' && this.renderOptions()}
          {value === 'stake' && this.renderStake()}
          {value === 'claim' && this.renderClaim()}
          {value === 'unstake' && this.renderUnstake()}
          {value === 'exit' && this.renderExit()}

          {snackbarMessage && this.renderSnackbar()}
          {loading && <Loader />}
          </div>
      </div>
    )
  }

  setAnchorEl = anchorEl => {
    this.setState({ anchorEl: anchorEl })
  }

  handleClick = (event) => {
    this.setAnchorEl(this.state.anchorEl ? null : event.currentTarget);
  };

  handleClose = () => {
    this.setAnchorEl(null);
  };


  // 领取奖励的按钮 ：
  // 0: 需要去投票
  // 退出按钮

  // 取消质押的按钮：

  // 有值 且 小于当前区块高度：需要等到xxx区块才能取消
  // 0: 需要去投票
  // 有值 且 小于当前区块高度： 要等到xxx区块才能取消

  renderOptions = () => {
    const { classes, t } = this.props;
    const { loading, pool, voteLockValid, balanceValid, anchorEl, voteLock } = this.state

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
      <div className={classes.actions}>
        <div className={classes.actionContainer}>
          <Button
            fullWidth
            className={`${classes.primaryButton} loanBtn`}
            variant="outlined"
            color="primary"
            disabled={!pool.depositsEnabled || (pool.id === 'Fee Rewards' ? (loading || !voteLockValid || !balanceValid) : loading)}
            onClick={() => { this.navigateInternal('stake') }}
          >
            <Typography className={`${classes.stakeButtonText}`} variant={'h4'}>{t('Stake.StakeTokens')}</Typography>
          </Button>
        </div>
        <div className={classes.actionContainer}>
          <Button
            fullWidth
            className={`${classes.actionButton} rewardBtn`}
            variant="outlined"
            color="primary"
            disabled={loading}
            aria-describedby={id}
            onClick={(pool.id === 'Governance V2' && (voteLock == 0)) ? this.handleClick : this.onClaim} // 只有当投票页面voteLock等于0，弹框提示
          >
            <Typography className={classes.buttonText} variant={'h4'}>{t('Stake.ClaimRewards')}</Typography>
          </Button>
        </div>
        <div className={classes.actionContainer}>
          <Button
            fullWidth
            className={`${classes.actionButton} cancleBtn`}
            variant="outlined"
            color="primary"
            disabled={loading}
            // onClick={ () => { this.navigateInternal('unstake') } }
            onClick={(pool.id === 'Governance V2' && voteLock !== 0 && voteLockValid) ? this.handleClick : this.navigateInternal.bind(this, 'unstake')}
          >
            <Typography className={classes.buttonText} variant={'h4'}>{t('Stake.UnstakeTokens')}</Typography>
          </Button>
        </div>
        <div className={classes.actionContainer}>
          <Button
            fullWidth
            className={classes.actionButton}
            variant="outlined"
            color="primary"
            aria-describedby={id}
            disabled={loading || pool.id === 'Governance V2'}
            onClick={(pool.id === 'Governance V2' && (voteLock == 0 || voteLockValid)) ? this.handleClick : this.onExit}
          >
            <Typography className={classes.buttonText} variant={'h4'}>{t('Stake.Exit')}</Typography>
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={this.handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Typography className={classes.buttonText} variant={'h4'}>{voteLock !== 0 && voteLockValid ? `${t('Stake.ComeSoon2')} ${voteLock}` : `${t('Stake.ComeSoon')}`}</Typography>
          </Popover>
        </div>
      </div>
    )
  }

  navigateInternal = (val) => {
    this.setState({ value: val})
  }

  renderStake = () => {
    const { classes, t } = this.props;
    const { loading, pool } = this.state

    const asset = pool.tokens[0]
    // if(this.showStake){
      return (
        <div className="win-stake">
          {/* <Typography className={classes.stakeTitle} variant={'h3'}>{t('Stake.StakeYourTokens')}</Typography> */}
          { this.renderAssetInput(asset, 'stake')}
          <div className={classes.stakeButtons}>
            <Button
              className={classes.stakeButton}
              variant="outlined"
              color="secondary"
              disabled={loading}
              onClick={() => { this.navigateInternal('options') }}
            >
              <Typography variant={'h4'}>{t('Stake.Back')}</Typography>
            </Button>
            <Button
              className={classes.stakeButton}
              variant="outlined"
              color="secondary"
              disabled={loading}
              onClick={() => { this.onStake() }}
            >
              <Typography variant={'h4'}>{t('Stake.Stake')}</Typography>
            </Button>
          </div>
  
        </div>
      )
    // }
    
  }

  renderUnstake = () => {
    const { classes, t } = this.props;
    const { loading, pool, voteLockValid } = this.state

    const asset = pool.tokens[0]

    return (
      <div className="win-unstake">
        <Typography className={classes.stakeTitle} variant={'h3'}>{t('Stake.UnstakeYourTokens')}</Typography>
        { this.renderAssetInput(asset, 'unstake')}
        <div className={classes.stakeButtons}>
          <Button
            className={classes.stakeButton}
            variant="outlined"
            color="secondary"
            disabled={loading}
            onClick={() => { this.navigateInternal('options') }}
          >
            <Typography variant={'h4'}>{t('Stake.Back')}</Typography>
          </Button>
          <Button
            className={classes.stakeButton}
            variant="outlined"
            color="secondary"
            disabled={(pool.id === 'Governance' ? (loading || voteLockValid) : loading)}
            onClick={() => { this.onUnstake() }}
          >
            <Typography variant={'h4'}>{t('Stake.Unstake')}</Typography>
          </Button>
        </div>

      </div>
    )
  }

  overlayClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  onStake = () => {
    this.setState({ amountError: false})
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]
    const amount = this.state[selectedToken.id + '_stake']

    // if(amount > selectedToken.balance) {
    //   return false
    // }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: STAKE, content: { asset: selectedToken, amount: amount } })
    this.navigateInternal('options')
  }

  onClaim = () => {
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]

    this.setState({ loading: true })
    dispatcher.dispatch({ type: GET_REWARDS, content: { asset: selectedToken } })
  }

  onUnstake = () => {
    this.setState({ amountError: false })
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]
    const amount = this.state[selectedToken.id + '_unstake']
    //
    // if(amount > selectedToken.balance) {
    //   return false
    // }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: WITHDRAW, content: { asset: selectedToken, amount: amount } })
    this.navigateInternal('options')
  }

  onExit = () => {
    const { pool } = this.state
    const tokens = pool.tokens
    const selectedToken = tokens[0]

    this.setState({ loading: true })
    dispatcher.dispatch({ type: EXIT, content: { asset: selectedToken } })
  }

  renderAssetInput = (asset, type) => {
    const {
      classes
    } = this.props

    const {
      loading
    } = this.state

    // const amount = this.state[asset.id + '_' + type]
    const amountError = this.state[asset.id + '_' + type + '_error']

    return (
      <div className={classes.valContainer} key={asset.id + '_' + type}>
        <div className={classes.balances}>
          {type === 'stake' && <Typography variant='h4' onClick={() => { this.setAmount(asset.id, type, (asset ? asset.balance : 0)) }} className={classes.value} noWrap>{'Balance: ' + (asset && asset.balance ? (Math.floor(asset.balance * 10000) / 10000).toFixed(4) : '0.0000')} {asset ? asset.symbol : ''}</Typography>}
          {type === 'unstake' && <Typography variant='h4' onClick={() => { this.setAmount(asset.id, type, (asset ? asset.stakedBalance : 0)) }} className={classes.value} noWrap>{'Balance: ' + (asset && asset.stakedBalance ? (Math.floor(asset.stakedBalance * 10000) / 10000).toFixed(4) : '0.0000')} {asset ? asset.symbol : ''}</Typography>}
        </div>
        <div>
          <TextField
            fullWidth
            disabled={loading}
            className={classes.actionInput}
            id={'' + asset.id + '_' + type}
            // value={amount || ''}
            error={amountError}
            // onChange={this.onChange.bind(this)}
            onChange={this.onChange.bind(this, type === 'stake' ? (asset && asset.balance ? (Math.floor(asset.balance * 10000) / 10000).toFixed(4) : '0.0000') : (asset && asset.stakedBalance ? (Math.floor(asset.stakedBalance * 10000) / 10000).toFixed(4) : '0.0000'))}
            placeholder="0.00"
            variant="outlined"
            InputProps={{
              endAdornment: <InputAdornment position="end" className={classes.inputAdornment}><Typography variant='h3' className={''}>{asset.symbol}</Typography></InputAdornment>,
              startAdornment: <InputAdornment position="end" className={classes.inputAdornment}>
                <div className={classes.assetIcon}>
                  <img
                    alt=""
                    src={require('../../assets/' + asset.symbol + '-logo.png')}
                    height="30px"
                  />
                </div>
              </InputAdornment>,
            }}
          />
        </div>
      </div>
    )
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={snackbarType} message={snackbarMessage} open={true} />
  };

  // onChange = (event)=>{
  //   console.log(event.target.value)
  // }
  onChange = (value, event) => {
    let val = []
    // val[event.target.id] = value > parseFloat(event.target.value) ? event.target.value : (value + '')
    val[event.target.id] = value > parseFloat(event.target.value) ? event.target.value : (value + '')
    this.setState(val)
  }

  setAmount = (id, type, balance) => {
    const bal = (Math.floor((balance === '' ? '0' : balance) * 10000) / 10000).toFixed(4)
    let val = []
    val[id + '_' + type] = bal
    this.setState(val)
  }

}

export default withNamespaces()(withRouter(withStyles(styles)(Stake)));
