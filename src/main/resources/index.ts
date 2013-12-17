module darkgame
{
	export class DarkGame
	{
		private reel: Reel;

		constructor()
		{
			var canvas:HTMLCanvasElement = <HTMLCanvasElement>window.document.getElementById("gamecanvas");
			var context:CanvasRenderingContext2D = canvas.getContext("2d");

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
			this.reel = new Reel(3, 10, 10, strip);

			// TODO: Maybe do another context here and backbuffer it
			// TODO: Here we can pass in current timestamp so we can calculate the delta in the next loop
			window.requestAnimationFrame((timestamp)=>this.mainLoop(timestamp, context));
			
		}


		private mainLoop(timestamp: number, context: CanvasRenderingContext2D ):void
		{

			this.reel.update();
			this.reel.render(context);

			window.requestAnimationFrame((timestamp)=>this.mainLoop(timestamp, context));
		}

	}



	export class Reel
	{
		private symbolsWindowHeight: number;
		private strip: ReelStrip;
		private stripPointer: number;
		private x:number;
		private y:number;
		private symbols:Array<Symbol>;
		private symbolOffset: number;
		private symbolWidth: number;
		private symbolHeight: number;

		constructor(symbolsWindowHeight: number, x:number, y:number, strip: ReelStrip)
		{
			this.symbolsWindowHeight = symbolsWindowHeight;
			this.strip = strip;
			this.stripPointer = 0;
			this.x = x;
			this.y = y;

			//TODO: The reels maybe want a velocity

			this.symbols = [];

			this.symbolOffset = 0;
			this.symbolWidth = 100;
			this.symbolHeight = 100;

			this.populate();

			//TODO: Should the reel keep it's state: spinning, stopping, etc?

		}

		//TOODO: Maybe this function should not be used by the update() function. Nicer?
		private populate():void
		{
			var symbol:Symbol;

			// keep one outside the top and one outside the bottom
			while (this.symbols.length < this.symbolsWindowHeight + 2)
			{
				symbol = this.strip.getNthSymbol(this.stripPointer);
				this.symbols.unshift( symbol );
				this.stripPointer++;
			}
		}


		public render(context: CanvasRenderingContext2D):void
		{
			//TODO: Should the reel take the context in the constructor? In that case we can't do backbuffering so easy. Is that even needed?

			context.fillStyle = "#FFFFFF";
			context.fillRect(0,0,800,600);

			// TODO: When having oversized symbols we need to do skip them in the first pass and then make a second pass and draw those ontop
			for (var i:number = 0; i < this.symbols.length; i++)
			{

				// TODO: Pull an image here instead
				// Set the color
				//context.fillStyle = this.symbols[i].getColor();

				//TODO: Make sure to not draw anything outside the actual view
				var image:HTMLImageElement = this.symbols[i].getImage();

				var x:number = 0;
				var y:number = this.symbolOffset + this.symbolHeight * i - this.symbolHeight;
				context.drawImage(image, this.symbolHeight, this.symbolHeight, image.naturalHeight, image.naturalWidth, x, y, this.symbolWidth, this.symbolHeight);
				//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
			}
		}

		//TODO: Take the time delta for smooth animation
		public update():void
		{
			//TODO: Remember that the reels cant run backwards. Fix that? (Could be needed with hard stop bounces?)

			//TODO: Keep track of what velocity to use and bounce nice when we should stop etc
			this.symbolOffset += 0.5;

			while ( this.symbolOffset >= this.symbolHeight )
			{
				this.symbols.pop();
				this.populate();
				this.symbolOffset -= this.symbolHeight;
			}


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
		 * 0th symbol is the one in the bottom of the strip.
		 */
		public getNthSymbol(n:number):Symbol
		{
			// mod to avoid out of index
			n = n % this.symbols.length;

			// first is the last index.
			return this.symbols[this.symbols.length -1 -n];
		}
	}

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

}

// boostrap
var game:darkgame.DarkGame = new darkgame.DarkGame();