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
		private prepareStoppingPositionManager: darkgame.PrepareStoppingPositionManager = new darkgame.PrepareStoppingPositionManager();

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
			this.stoppedPositionManager.start(0);

			
		}


		public start():void
		{
			//TODO: Where do we find the current stopped positon and timestamp?
			// inline it in the stopped position manager?


			// Stop the stopped position manager and therefore start the starting
			this.stoppedPositionManager.stop((stoppedPosition, stoppedTimestamp)=>
			{
				// stopped done. start starting
				this.currentPositionManager = this.startingPositionManager;
				this.startingPositionManager.start(stoppedPosition, stoppedTimestamp, this.symbolHeight, 500, (startingPosition, startingVelocity, startingTimestamp)=>
				{
					// starting done. start running
					this.currentPositionManager = this.runningPositionManager;
					this.runningPositionManager.start(startingPosition, startingTimestamp, startingVelocity);
				});
			});
	
		}

		public stop(stopSymbolIndex:number):void
		{
		

			// begin to stop
			this.runningPositionManager.stop((runningPosition:number, runningTimestamp:number, runningVelocity:number)=>{
				console.log("stopping");
				this.currentPositionManager = this.prepareStoppingPositionManager;

				// calculate stop position
				var flushSymbolsCount:number = this.numberOfVisibleSymbols + stopSymbolIndex;
				
				// complete the symbol you are rolling and then roll three more before exiting running and slowing down
				var stopPosition:number = this.lastPosition;
				stopPosition = stopPosition / this.symbolHeight;
				stopPosition = Math.floor(stopPosition);
				stopPosition = stopPosition * this.symbolHeight;
				
				// roll this amount of pixels before stopping. The position needs to be ahead
				// we want to roll out all visible symbols before we stop
				stopPosition = stopPosition + this.symbolHeight * flushSymbolsCount; 

				// set the strip index to some back so we can roll a couple before we stop
				this.infiniteReelStripIndexPointer = this.infiniteReelStrip.getFiniteLength() * 2 - stopSymbolIndex - flushSymbolsCount; 


				//fromPosition: number, toPosition:number, fromTime:number, velocity:number
				this.prepareStoppingPositionManager.start(runningPosition, stopPosition, runningTimestamp, runningVelocity, (preparePositon:number, prepareVelocity:number, prepareTime:number)=>{
					console.log("prepare stopping done");
					this.currentPositionManager = this.stoppingPositionManager;
					//fromPosition:number, fromTime:number, distance:number, duration:number
					this.stoppingPositionManager.start(preparePositon, prepareTime, this.symbolHeight, 500, (stoppingPosition: number, stoppingTimestamp:number)=>{
						console.log("stopping done");
						this.currentPositionManager = this.stoppedPositionManager;
						this.stoppedPositionManager.start(stoppingPosition);
					});
				});
			});
			

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