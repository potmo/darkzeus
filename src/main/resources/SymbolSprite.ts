module darkgame
{
	export class SymbolSprite
	{
		private symbol:darkgame.Symbol;
		private position:number;
		

		constructor(symbol:darkgame.Symbol, position:number )
		{
			this.symbol = symbol;
			this.position = position;
		}

		public getImage():HTMLImageElement
		{
			return this.symbol.getImage();
		}

		public getPosition():number
		{
			return this.position;
		}

		public move(delta:number):void
		{
			this.position += delta;
		}
	}
}