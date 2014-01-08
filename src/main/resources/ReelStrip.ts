module darkgame
{
	export class ReelStrip
	{
		private symbols: Array<darkgame.Symbol>;

		constructor(symbols: Array<darkgame.Symbol>)
		{
			this.symbols = symbols;
		}

		/*
		 * the 0th symbol is on the last index of the array.
		 */
		public getNthSymbol(n:number):Symbol
		{
			// mod to avoid out of index
			n = n % this.symbols.length;

			// first is the last index.
			return this.symbols[this.symbols.length -1 -n];
		}

		public getFiniteLength():number
		{
			return this.symbols.length;
		}
	}
}