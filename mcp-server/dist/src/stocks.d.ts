/**
 * Stock and Portfolio data layer for the Investment Simulator demo.
 * Contains mock stock data, portfolio management, and trading logic.
 */
export type Sector = "technology" | "healthcare" | "finance" | "energy" | "consumer" | "industrial";
export type RiskTolerance = "conservative" | "moderate" | "aggressive";
export type PortfolioFocus = "tech" | "healthcare" | "diversified" | "growth" | "dividend";
/**
 * Represents a stock in the market.
 */
export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    sector: Sector;
    volatility: number;
    dividendYield: number;
}
/**
 * Represents a holding in a portfolio.
 */
export interface Holding {
    symbol: string;
    name: string;
    shares: number;
    avgCost: number;
    currentPrice: number;
    change: number;
    value: number;
    profitLoss: number;
}
/**
 * Historical data point for performance chart.
 */
export interface PerformancePoint {
    date: string;
    value: number;
}
/**
 * Represents a user's investment portfolio.
 */
export interface Portfolio {
    id: string;
    cash: number;
    holdings: Holding[];
    totalValue: number;
    totalProfitLoss: number;
    allocation: {
        stocks: number;
        cash: number;
    };
    performance: PerformancePoint[];
}
/**
 * Trade action type.
 */
export type TradeAction = "buy" | "sell";
/**
 * Result of a trade execution.
 */
export interface TradeResult {
    success: boolean;
    message: string;
    portfolio?: Portfolio;
    trade?: {
        action: TradeAction;
        symbol: string;
        shares: number;
        price: number;
        total: number;
    };
}
/**
 * Get all available stocks.
 */
export declare function getStocks(): Stock[];
/**
 * Get stock by symbol.
 */
export declare function getStockBySymbol(symbol: string): Stock | undefined;
/**
 * Create a new portfolio based on user preferences.
 */
export declare function createPortfolio(options: {
    initialBalance: number;
    riskTolerance: RiskTolerance;
    focus: PortfolioFocus;
}): {
    portfolio: Portfolio;
    availableStocks: Stock[];
};
/**
 * Get portfolio by ID.
 */
export declare function getPortfolio(portfolioId: string): Portfolio | undefined;
/**
 * Execute a trade (buy or sell).
 */
export declare function executeTrade(portfolioId: string, symbol: string, action: TradeAction, quantity: number): TradeResult;
/**
 * Refresh stock prices with random small changes.
 */
export declare function refreshPrices(portfolioId: string): {
    portfolio: Portfolio;
    availableStocks: Stock[];
} | undefined;
//# sourceMappingURL=stocks.d.ts.map