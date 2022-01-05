export interface BinanceSymbols {
    timezone:        string;
    serverTime:      number;
    rateLimits:      RateLimit[];
    exchangeFilters: any[];
    symbols:         Symbol[];
}

export interface RateLimit {
    rateLimitType: string;
    interval:      string;
    intervalNum:   number;
    limit:         number;
}

export interface Symbol {
    symbol:                     string;
    status:                     Status;
    baseAsset:                  string;
    baseAssetPrecision:         number;
    quoteAsset:                 QuoteAsset;
    quotePrecision:             number;
    quoteAssetPrecision:        number;
    baseCommissionPrecision:    number;
    quoteCommissionPrecision:   number;
    orderTypes:                 OrderType[];
    icebergAllowed:             boolean;
    ocoAllowed:                 boolean;
    quoteOrderQtyMarketAllowed: boolean;
    isSpotTradingAllowed:       boolean;
    isMarginTradingAllowed:     boolean;
    filters:                    Filter[];
    permissions:                Permission[];
}

export interface Filter {
    filterType:        FilterType;
    minPrice?:         string;
    maxPrice?:         string;
    tickSize?:         string;
    multiplierUp?:     string;
    multiplierDown?:   string;
    avgPriceMins?:     number;
    minQty?:           string;
    maxQty?:           string;
    stepSize?:         string;
    minNotional?:      string;
    applyToMarket?:    boolean;
    limit?:            number;
    maxNumOrders?:     number;
    maxNumAlgoOrders?: number;
    maxPosition?:      string;
}

export enum FilterType {
    IcebergParts = "ICEBERG_PARTS",
    LotSize = "LOT_SIZE",
    MarketLotSize = "MARKET_LOT_SIZE",
    MaxNumAlgoOrders = "MAX_NUM_ALGO_ORDERS",
    MaxNumOrders = "MAX_NUM_ORDERS",
    MaxPosition = "MAX_POSITION",
    MinNotional = "MIN_NOTIONAL",
    PercentPrice = "PERCENT_PRICE",
    PriceFilter = "PRICE_FILTER",
}

export enum OrderType {
    Limit = "LIMIT",
    LimitMaker = "LIMIT_MAKER",
    Market = "MARKET",
    StopLossLimit = "STOP_LOSS_LIMIT",
    TakeProfitLimit = "TAKE_PROFIT_LIMIT",
}

export enum Permission {
    Leveraged = "LEVERAGED",
    Margin = "MARGIN",
    Spot = "SPOT",
}

export enum QuoteAsset {
    Aud = "AUD",
    Bidr = "BIDR",
    Bkrw = "BKRW",
    Bnb = "BNB",
    Brl = "BRL",
    Btc = "BTC",
    Busd = "BUSD",
    Bvnd = "BVND",
    Dai = "DAI",
    Doge = "DOGE",
    Eth = "ETH",
    Eur = "EUR",
    Gbp = "GBP",
    Gyen = "GYEN",
    Idrt = "IDRT",
    Ngn = "NGN",
    Pax = "PAX",
    Rub = "RUB",
    Trx = "TRX",
    Try = "TRY",
    Tusd = "TUSD",
    Uah = "UAH",
    Usdc = "USDC",
    Usdp = "USDP",
    Usds = "USDS",
    Usdt = "USDT",
    Vai = "VAI",
    Xrp = "XRP",
    Zar = "ZAR",
}

export enum Status {
    Break = "BREAK",
    Trading = "TRADING",
}

export interface CoingeckoSymbols {
    id:     string;
    symbol: string;
    name:   string;
}

export interface CoinGeckoCryptoInfo {
    id:                              ID;
    symbol:                          string;
    name:                            ID;
    asset_platform_id:               null;
    platforms:                       Platforms;
    block_time_in_minutes:           number;
    hashing_algorithm:               string;
    categories:                      string[];
    public_notice:                   null;
    additional_notices:              any[];
    localization:                    { [key: string]: ID };
    description:                     { [key: string]: ID };
    links:                           Links;
    image:                           Image;
    country_origin:                  string;
    genesis_date:                    null;
    sentiment_votes_up_percentage:   null;
    sentiment_votes_down_percentage: null;
    market_cap_rank:                 null;
    coingecko_rank:                  number;
    coingecko_score:                 number;
    developer_score:                 number;
    community_score:                 number;
    liquidity_score:                 number;
    public_interest_score:           number;
    market_data:                     MarketData;
    community_data:                  CommunityData;
    developer_data:                  DeveloperData;
    public_interest_stats:           PublicInterestStats;
    status_updates:                  any[];
    last_updated:                    string;
    tickers:                         Ticker[];
}

export interface CommunityData {
    facebook_likes:              null;
    twitter_followers:           number;
    reddit_average_posts_48h:    number;
    reddit_average_comments_48h: number;
    reddit_subscribers:          number;
    reddit_accounts_active_48h:  number;
    telegram_channel_user_count: number;
}

export enum ID {
    Empty = "",
    The01Coin = "01coin",
}

export interface DeveloperData {
    forks:                               number;
    stars:                               number;
    subscribers:                         number;
    total_issues:                        number;
    closed_issues:                       number;
    pull_requests_merged:                number;
    pull_request_contributors:           number;
    code_additions_deletions_4_weeks:    CodeAdditionsDeletions4_Weeks;
    commit_count_4_weeks:                number;
    last_4_weeks_commit_activity_series: number[];
}

export interface CodeAdditionsDeletions4_Weeks {
    additions: number;
    deletions: number;
}

export interface Image {
    thumb: string;
    small: string;
    large: string;
}

export interface Links {
    homepage:                      string[];
    blockchain_site:               string[];
    official_forum_url:            string[];
    chat_url:                      string[];
    announcement_url:              string[];
    twitter_screen_name:           string;
    facebook_username:             string;
    bitcointalk_thread_identifier: number;
    telegram_channel_identifier:   string;
    subreddit_url:                 string;
    repos_url:                     ReposURL;
}

export interface ReposURL {
    github:    string[];
    bitbucket: any[];
}

export interface MarketData {
    current_price:                                { [key: string]: number };
    total_value_locked:                           null;
    mcap_to_tvl_ratio:                            null;
    fdv_to_tvl_ratio:                             null;
    roi:                                          null;
    ath:                                          { [key: string]: number };
    ath_change_percentage:                        { [key: string]: number };
    ath_date:                                     { [key: string]: string };
    atl:                                          { [key: string]: number };
    atl_change_percentage:                        { [key: string]: number };
    atl_date:                                     { [key: string]: string };
    market_cap:                                   { [key: string]: number };
    market_cap_rank:                              null;
    fully_diluted_valuation:                      FullyDilutedValuation;
    total_volume:                                 { [key: string]: number };
    high_24h:                                     { [key: string]: number };
    low_24h:                                      { [key: string]: number };
    price_change_24h:                             number;
    price_change_percentage_24h:                  number;
    price_change_percentage_7d:                   number;
    price_change_percentage_14d:                  number;
    price_change_percentage_30d:                  number;
    price_change_percentage_60d:                  number;
    price_change_percentage_200d:                 number;
    price_change_percentage_1y:                   number;
    market_cap_change_24h:                        number;
    market_cap_change_percentage_24h:             number;
    price_change_24h_in_currency:                 { [key: string]: number };
    price_change_percentage_1h_in_currency:       FullyDilutedValuation;
    price_change_percentage_24h_in_currency:      { [key: string]: number };
    price_change_percentage_7d_in_currency:       { [key: string]: number };
    price_change_percentage_14d_in_currency:      { [key: string]: number };
    price_change_percentage_30d_in_currency:      { [key: string]: number };
    price_change_percentage_60d_in_currency:      FullyDilutedValuation;
    price_change_percentage_200d_in_currency:     { [key: string]: number };
    price_change_percentage_1y_in_currency:       { [key: string]: number };
    market_cap_change_24h_in_currency:            { [key: string]: number };
    market_cap_change_percentage_24h_in_currency: { [key: string]: number };
    total_supply:                                 number;
    max_supply:                                   null;
    circulating_supply:                           number;
    last_updated:                                 string;
}

export interface FullyDilutedValuation {
}

export interface Platforms {
    "": string;
}

export interface PublicInterestStats {
    alexa_rank:   number;
    bing_matches: null;
}

export interface Ticker {
    base:                      string;
    target:                    string;
    market:                    Market;
    last:                      number;
    volume:                    number;
    converted_last:            { [key: string]: number };
    converted_volume:          { [key: string]: number };
    trust_score:               string;
    bid_ask_spread_percentage: number;
    timestamp:                 string;
    last_traded_at:            string;
    last_fetch_at:             string;
    is_anomaly:                boolean;
    is_stale:                  boolean;
    trade_url:                 string;
    token_info_url:            null;
    coin_id:                   ID;
    target_coin_id:            string;
}

export interface Market {
    name:                  string;
    identifier:            string;
    has_trading_incentive: boolean;
}

export interface CryptoInfo extends CoingeckoSymbols{
    alert:              boolean;
    index:              number;
    lastPrice:          number;
    checkTime:          number;
}
