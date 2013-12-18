module darkgame
{
	export class DarkGame
	{
		private reel: Reel;

		constructor()
		{
			var canvas:HTMLCanvasElement = <HTMLCanvasElement>window.document.getElementById("gamecanvas");
			var context:CanvasRenderingContext2D = canvas.getContext("2d");

			//TODO: Get this from resource bundle instead
			var stripSymbols: Array<Symbol> = [];
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol01") ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol02") ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol03") ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol04") ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol05") ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol06") ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol07") ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol08") ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol09") ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol10") ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol11") ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol12") ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol13") ) );

			var strip: ReelStrip = new ReelStrip(stripSymbols);

			//TODO: Make more reels.
			this.reel = new Reel(5, strip, 100, 100);

			// TODO: Maybe do another context here and backbuffer it
			// TODO: Here we can pass in current timestamp so we can calculate the delta in the next loop
			var startTime: number = window.performance.now();
			window.requestAnimationFrame((timestamp:number)=>{
				this.mainLoop(timestamp, startTime, context);
			});
			
		}


		private mainLoop(timestamp:number, lastFrameTimestamp:number, context: CanvasRenderingContext2D ):void
		{

			var timeDelta: number = timestamp - lastFrameTimestamp;
			var speedMultiplier: number = timeDelta / (1000 / 60); // 60 FPS is perfect

			this.reel.update(speedMultiplier);
			this.reel.render(context);

			lastFrameTimestamp = timestamp;
			window.requestAnimationFrame((timestamp)=>this.mainLoop(timestamp, lastFrameTimestamp, context));
		}

	}



	export class Reel
	{
		private numberOfVisibleSymbols: number;
		private infiniteReelStrip: ReelStrip;
		private infiniteReelStripIndexPointer: number;
		private visibleSymbols:Array<SymbolSprite>;
		private symbolWidth: number;
		private symbolHeight: number;

		private velocity: number = 300;
		private position: number = 0;
		private x:number;
		private y:number;

		private starting: boolean = false;
		private spinning: boolean = false;
		private stopping: boolean = false;

		constructor(numberOfVisibleSymbols: number, infiniteReelStrip: ReelStrip, x:number, y:number)
		{
			this.numberOfVisibleSymbols = numberOfVisibleSymbols;
			this.infiniteReelStrip = infiniteReelStrip;
			this.infiniteReelStripIndexPointer = 0;

			this.x = x;
			this.y = y;
			

			//TODO: The reels maybe want a velocity

			this.visibleSymbols = [];

			this.symbolWidth = 100;
			this.symbolHeight = 100;

			//TODO: Do we want to start at a random position maybe? In that case randomize the infiniteReelStripIndexPointer

			// add the starting symbols
			for (var i:number = 0; i < numberOfVisibleSymbols + 2; i++)
			{
				// move all other symbols since there will be one unshifted above them

				for (var j:number = 0; j < this.visibleSymbols.length; j++ )
				{
					this.visibleSymbols[j].move( this.symbolHeight );
				}

				this.visibleSymbols.unshift( this.createSymbolSpriteFromInfiniteReelStrip() );


			}

			//TODO: Should the reel keep it's state: spinning, stopping, etc?

		}


		private createSymbolSpriteFromInfiniteReelStrip():SymbolSprite
		{

			var symbol:Symbol;
			symbol = this.infiniteReelStrip.getNthSymbol(this.infiniteReelStripIndexPointer);
			this.infiniteReelStripIndexPointer++;

			return new SymbolSprite(symbol, 0);
		}

		private getReelViewportHeight():number
		{
			return this.numberOfVisibleSymbols * this.symbolHeight;
		}


		public render(context: CanvasRenderingContext2D):void
		{
			//TODO: Should the reel take the context in the constructor? In that case we can't do backbuffering so easy. Is that even needed?

			context.fillStyle = "#FFFFFF";
			context.fillRect(0,0,800,600);

			// TODO: When having oversized symbols we need to do skip them in the first pass and then make a second pass and draw those ontop
			for (var i:number = 0; i < this.visibleSymbols.length; i++)
			{

				var image:HTMLImageElement = this.visibleSymbols[i].getImage();

				
				var offsetX:number = 0;
				var offsetY:number = this.visibleSymbols[i].getPosition() - this.symbolHeight;

				var amountOver:number = Math.abs(Math.min(0, offsetY));
				var pixelHeight:number = this.symbolHeight * this.numberOfVisibleSymbols;
				var amountUnder:number = Math.max(0, (offsetY + this.symbolHeight) - pixelHeight);

				var srcX: number = 0;
				var srcY: number = amountOver;
				var srcWidth: number = this.symbolWidth;
				var srcHeight: number = this.symbolHeight - amountOver - amountUnder;
				var dstX: number  = this.x + offsetX;
				var dstY: number = this.y + offsetY + amountOver;
				var dstWidth: number = this.symbolWidth;
				var dstHeight: number = this.symbolHeight - amountOver - amountUnder;


				context.drawImage(image, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight);

			}
		}

		//TODO: Take the time delta for smooth animation
		public update(speedMultiplier: number):void
		{
			//TODO: Remember that the reels cant run backwards. Fix that? (Could be needed with hard stop bounces?)

			//TODO: Keep track of what velocity to use and bounce nice when we should stop etc
			
			var moveDelta: number = this.velocity * speedMultiplier;

			// There is one symbol that should be outside the viewport so make sure that one is not removed
			var reelViewportHeight:number = this.getReelViewportHeight() + 2 * this.symbolHeight;

			// move all the symbols
			for (var i:number = 0; i < this.visibleSymbols.length; i++)
			{
				this.visibleSymbols[i].move( moveDelta );
			}

			// remove symbols outside the viewport
			while ( this.visibleSymbols[ this.visibleSymbols.length - 1].getPosition() > reelViewportHeight )
			{
				var oldSymbol: SymbolSprite = this.visibleSymbols.pop( );

				var overFlow:number = oldSymbol.getPosition() - reelViewportHeight;

				var newSymbol: SymbolSprite = this.createSymbolSpriteFromInfiniteReelStrip();

				newSymbol.move( overFlow );

				this.visibleSymbols.unshift( newSymbol )
			}

			this.position += moveDelta;
			this.velocity = Math.max(1,this.velocity * 0.95);


		}
	}

	export class ReelStrip
	{
		private symbols: Array<Symbol>;

		constructor(symbols: Array<Symbol>)
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
	}

	/*
	 * A Symbol 
	 */
	export class Symbol
	{
		//TODO: This should be an image instead of just a color
		private img:HTMLImageElement;
		constructor(img:HTMLImageElement)
		{
			this.img = img;
		}

		public getImage():HTMLImageElement
		{
			return this.img;
		}
	}

	/*
	 * 
	 */
	export class SymbolSprite
	{
		private symbol:Symbol;
		private position:number;

		constructor(symbol:Symbol, position:number )
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

// boostrap
var game:darkgame.DarkGame = new darkgame.DarkGame();