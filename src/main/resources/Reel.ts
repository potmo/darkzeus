module darkgame
{
	export class Reel
	{
		private numberOfVisibleSymbols: number;
		private infiniteReelStrip: darkgame.ReelStrip;
		private infiniteReelStripIndexPointer: number;
		private visibleSymbols:Array<darkgame.SymbolSprite>;
		private symbolWidth: number;
		private symbolHeight: number;

		private x:number;
		private y:number;

		private currentPositionManager: darkgame.IPositionManager;
		private lastPosition: number = 0;

		//TODO: Inject theese
		private stoppedPositionManager: darkgame.StoppedPositionManager = new darkgame.StoppedPositionManager();
		private runningPositionManager: darkgame.RunningPositionManager = new darkgame.RunningPositionManager();
		private stoppingPositionManager: darkgame.StoppingPositionManager = new darkgame.StoppingPositionManager();
		private startingPositionManager: darkgame.StartingPositionManager = new darkgame.StartingPositionManager();

		constructor(numberOfVisibleSymbols: number, infiniteReelStrip: darkgame.ReelStrip, x:number, y:number)
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

		private createSymbolSpriteFromInfiniteReelStrip():darkgame.SymbolSprite
		{

			//TODO: Break into factory or something
			var symbol:darkgame.Symbol;
			symbol = this.infiniteReelStrip.getNthSymbol(this.infiniteReelStripIndexPointer);
			this.infiniteReelStripIndexPointer++;

			return new darkgame.SymbolSprite(symbol, 0);
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
}