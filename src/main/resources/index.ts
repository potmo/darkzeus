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
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol00"), 00 ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol01"), 01 ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol02"), 02 ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol03"), 03 ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol04"), 04 ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol05"), 05 ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol06"), 06 ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol07"), 07 ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol08"), 08 ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol09"), 09 ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol10"), 10 ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol11"), 11 ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol12"), 12 ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol13"), 13 ) );
			stripSymbols.push( new Symbol( <HTMLImageElement>document.getElementById("symbol14"), 14 ) );

			var strip: ReelStrip = new ReelStrip(stripSymbols);

			//TODO: Make more reels.
			this.reel = new Reel(5, strip, 100, 100);

			// TODO: Maybe do another context here and backbuffer it
			// TODO: Here we can pass in current timestamp so we can calculate the delta in the next loop
			var startTime: number = window.performance.now();
			window.requestAnimationFrame((timestamp:number)=>{
				this.mainLoop(timestamp, startTime, context);
			});

			canvas.addEventListener("click",(ev:Event)=>{
				this.startReels();
			},false);
			
		}

		private startReels():void
		{
			this.reel.toggleStart();
		}


		private mainLoop(timestamp:number, lastFrameTimestamp:number, context: CanvasRenderingContext2D ):void
		{

			var timeDelta: number = timestamp - lastFrameTimestamp;
			var speedMultiplier: number = timeDelta / (1000 / 60); // 60 FPS is perfect

			this.reel.update(timestamp);
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

		private x:number;
		private y:number;

		private currentPositionManager: IPositionManager;
		private lastPosition: number = 0;

		private stoppedPositionManager: darkgame.StoppedPositionManager = new darkgame.StoppedPositionManager();
		private runningPositionManager: darkgame.RunningPositionManager = new darkgame.RunningPositionManager();
		private stoppingPositionManager: darkgame.StoppingPositionManager = new darkgame.StoppingPositionManager();
		private startingPositionManager: darkgame.StartingPositionManager = new darkgame.StartingPositionManager();

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

			this.currentPositionManager = this.stoppedPositionManager;
			this.stoppedPositionManager.start(0, (newPosition, newTimestamp)=>this.stoppedDone(newPosition, newTimestamp));
			
		}

		private stoppedDone(position:number, timestamp:number):void
		{
			this.currentPositionManager = this.startingPositionManager;
			this.startingPositionManager.start(position, timestamp, this.symbolHeight, 500, (newPosition, newTimestamp)=>this.startingDone(newPosition, newTimestamp));
		}

		private startingDone(position:number, timestamp:number):void
		{
			//TODO: Find out what the velocity was
			var oldPositionManager:darkgame.IPositionManager;
			oldPositionManager = this.currentPositionManager;
			this.currentPositionManager = this.runningPositionManager;
			this.runningPositionManager.start(position, timestamp, oldPositionManager.getVelocity(timestamp), (newPosition, newTimestamp)=>this.runningDone(newPosition, newTimestamp));
		}

		private runningDone(position:number, timestamp:number):void
		{
			//TODO: Find out what the velocity was
			//TODO: We need to know how long the stop should be. Always one symbol? 
			this.currentPositionManager = this.stoppingPositionManager;
			// move one more and let that slow down
			this.stoppingPositionManager.start(position, timestamp, this.symbolHeight, 500, (newPosition, newTimestamp)=>this.stoppingDone(newPosition, newTimestamp));
		}

		private stoppingDone(position:number, timestamp:number):void
		{
			this.currentPositionManager = this.stoppedPositionManager;
			this.stoppedPositionManager.start(position, (newPosition, newTimestamp)=>this.stoppedDone(newPosition, newTimestamp));
		}

		public toggleStart():void
		{
			if (this.currentPositionManager === this.stoppedPositionManager)
			{
				this.stoppedPositionManager.stop(); // ie stop the stopping and start spinning
			}else if (this.currentPositionManager === this.runningPositionManager)
			{
				var anticipateSymbolsCount:number = this.numberOfVisibleSymbols;
				var stopSymbolIndex:number = 14;

				// complete the symbol you are rolling and then roll three more before exiting running and slowing down
				var stopPosition:number = this.lastPosition;
				stopPosition = stopPosition / this.symbolHeight;
				stopPosition = Math.floor(stopPosition);
				stopPosition = stopPosition * this.symbolHeight;
				
				// roll this amount of pixels before stopping. The position needs to be ahead
				// we want to roll out all visible symbols before we stop
				stopPosition = stopPosition + this.symbolHeight * anticipateSymbolsCount; 

				// set the strip index to some back so we can roll a couple before we stop
				this.infiniteReelStripIndexPointer = this.infiniteReelStrip.getFiniteLength() * 2 - stopSymbolIndex - anticipateSymbolsCount; 

				console.log("stopping at: " + stopPosition + " index: " + this.infiniteReelStripIndexPointer)
				
				//TODO: This should be a pending stop position manager instead
				this.runningPositionManager.stop(stopPosition);
			}
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
		public update(timestamp: number):void
		{
			//TODO: Remember that the reels cant run backwards. Fix that? (Could be needed with hard stop bounces?)

			var newPosition:number = this.currentPositionManager.getPosition(timestamp);

			var moveDelta:number = newPosition - this.lastPosition;
			this.lastPosition = newPosition;
			
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

			// tick to the next state if done
			this.currentPositionManager.tick(timestamp);


		}
	}


	export class StoppingPositionManager implements IPositionManager
	{
		private fromPosition: number;
		private fromTime:number;
		private duration:number;
		private distance:number;

		private doneCallback:(position: number, timestamp:number)=>void;

		constructor()
		{
		}

		public start(fromPosition:number, fromTime:number, distance:number, duration:number, doneCallback:(position: number, timestamp:number)=>void):void
		{
			console.log("starting stopping");
			this.fromPosition = fromPosition;
			this.fromTime = fromTime;
			this.duration = duration;
			this.distance = distance;

			this.doneCallback = doneCallback;
		}

		public getPosition(currentTime:number):number
		{

			var timeDelta:number = currentTime - this.fromTime;		

			// linear ease
			var t:number = timeDelta / this.duration;

			//constrain
			t = Math.max(0, t);
			t = Math.min(1, t);

			//t = time;
			//b = startValue;
			//c = deltaChange;
			//d = duration;
			//s = strength? // 1.70158;


			//ease in back (http://easings.net/#easeInBack)
			//return c*(t/=d)*t*((s+1)*t - s) + b;

			// ease out back
			//return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;

			t = t - 1;
			var strength:number = 1.70158;
			return this.distance * (t*t*((strength+1)*t + strength) + 1) + this.fromPosition;
		}

		public getVelocity(currentTime:number):number
		{
			return 0.0;
		}

		public tick(currentTime:number)
		{
			var timeDelta:number = currentTime - this.fromTime;
			var t:number = timeDelta / this.duration;

			t = Math.max(0, t);
			t = Math.min(1, t);

			if (t >= 1.0)
			{
				this.doneCallback(this.getPosition(currentTime), currentTime);
			}
		}
	}

	export class StartingPositionManager implements IPositionManager
	{
		private fromPosition: number;
		private fromTime:number;
		private duration:number;
		private distance:number;

		private static BOUNCE_STRENGTH:number = 1.70158;

		private doneCallback:(position: number, timestamp:number)=>void;

		constructor()
		{			
		}

		public start(fromPosition:number, fromTime:number, distance:number, duration:number, doneCallback:(position: number, timestamp:number)=>void):void
		{
			console.log("starting starting");

			this.fromPosition = fromPosition;
			this.fromTime = fromTime;
			this.duration = duration;
			this.distance = distance;

			this.doneCallback = doneCallback;
		}

		public getPosition(currentTime:number):number
		{

			var timeDelta:number = currentTime - this.fromTime;		

			// linear ease
			var t:number = timeDelta / this.duration;

			//constrain
			t = Math.max(0, t);
			t = Math.min(1, t);
			
			return this.fromPosition + this.distance * t * ( ( StartingPositionManager.BOUNCE_STRENGTH + 1 ) * t - StartingPositionManager.BOUNCE_STRENGTH);

		}

		public getVelocity(currentTime:number):number
		{
			var timeDelta:number = currentTime - this.fromTime;		
			var t:number = timeDelta / this.duration;
			t = Math.max(0, t);
			t = Math.min(1, t);

			//console.log("A: " + this.getPosition(this.fromTime + this.duration - (1000/60))));
			//console.log("B: " + this.getPosition(this.fromTime + this.duration));

			return (this.distance * ( StartingPositionManager.BOUNCE_STRENGTH  * (2 * t - 1) + 2 * t)) / this.duration;
			return 2 * (StartingPositionManager.BOUNCE_STRENGTH + 1) * t - StartingPositionManager.BOUNCE_STRENGTH;

		}

		public tick(currentTime:number)
		{
			var timeDelta:number = currentTime - this.fromTime;
			var t:number = timeDelta / this.duration;

			t = Math.max(0, t);
			t = Math.min(1, t);



			if (t >= 1.0)
			{
				this.doneCallback(this.getPosition(currentTime), currentTime);
			}
		}
	}

	export class StoppedPositionManager implements IPositionManager
	{
		private atPosition: number;
		private done:boolean;
		private doneCallback:(position: number, timestamp:number)=>void;

		constructor()
		{

		}

		public start(atPosition: number,  doneCallback:(position: number, timestamp:number)=>void):void
		{
			console.log("starting stopped");

			this.doneCallback = doneCallback;
			this.atPosition = atPosition;
			this.done = false;
		}

		public stop():void
		{
			this.done = true;
			
		}

		public getPosition(currentTime:number):number
		{
			return this.atPosition;
		}

		public getVelocity(currentTime:number):number
		{
			return 0.0;
		}

		public tick(currentTime:number)
		{
			if (this.done)
			{
				this.doneCallback(this.getPosition(currentTime), currentTime);
			}
		}
	}

	export class RunningPositionManager implements IPositionManager
	{
		private fromPosition:number;
		private fromTime:number;
		private toPosition:number;
		private velocity:number;
		private done:boolean;
		private doneCallback:(position: number, timestamp:number)=>void;
		
		constructor()
		{
		}

		public start(fromPosition: number, fromTime:number, velocity:number, doneCallback:(position: number, timestamp:number)=>void):void
		{
			console.log("starting running");

			this.fromPosition = fromPosition;
			this.fromTime = fromTime;
			this.velocity = velocity;
			this.doneCallback = doneCallback;
			this.done = false;
		}

		public stop(stopPosition:number):void
		{
			this.done = true;
			this.toPosition = stopPosition;
		}

		public getPosition(currentTime:number):number
		{
			//TODO: Maybe this should be scaled somehow
			var timeDelta:number = currentTime - this.fromTime;

			return this.fromPosition + timeDelta * this.velocity;
		}

		public getVelocity(currentTime:number):number
		{
			return this.velocity;
		}

		public tick(currentTime:number)
		{
			if (this.done)
			{
				var currentPosition:number = this.getPosition(currentTime);
				if (this.toPosition <= currentPosition)
				{
					console.log("stopped. Just keep rolling some more");
					this.doneCallback(this.toPosition, currentTime);
				}
			}
		}
	}

	export interface IPositionManager
	{
		getVelocity(currentTime:number): number;
		getPosition(currentTime: number):number;
		tick(currentTime:number):void;
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

		public getFiniteLength():number
		{
			return this.symbols.length;
		}
	}

	/*
	 * A Symbol 
	 */
	export class Symbol
	{
		//TODO: This should be an image instead of just a color
		private img:HTMLImageElement;
		private index:number;
		constructor(img:HTMLImageElement, index:number)
		{
			this.img = img;
			this.index = index;
		}

		public getIndex():number
		{
			return this.index;
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