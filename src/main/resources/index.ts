module darkgame
{
	export class DarkGame
	{
		private reel: darkgame.Reel;

		constructor()
		{
			var canvas:HTMLCanvasElement = <HTMLCanvasElement>window.document.getElementById("gamecanvas");
			var context:CanvasRenderingContext2D = canvas.getContext("2d");

			//TODO: Get this from resource bundle instead
			var stripSymbols: Array<darkgame.Symbol> = [];
			stripSymbols.push( new darkgame.Symbol( <HTMLImageElement>document.getElementById("symbol00"), 00 ) );
			stripSymbols.push( new darkgame.Symbol( <HTMLImageElement>document.getElementById("symbol01"), 01 ) );
			stripSymbols.push( new darkgame.Symbol( <HTMLImageElement>document.getElementById("symbol02"), 02 ) );
			stripSymbols.push( new darkgame.Symbol( <HTMLImageElement>document.getElementById("symbol03"), 03 ) );
			stripSymbols.push( new darkgame.Symbol( <HTMLImageElement>document.getElementById("symbol04"), 04 ) );
			stripSymbols.push( new darkgame.Symbol( <HTMLImageElement>document.getElementById("symbol05"), 05 ) );
			stripSymbols.push( new darkgame.Symbol( <HTMLImageElement>document.getElementById("symbol06"), 06 ) );
			stripSymbols.push( new darkgame.Symbol( <HTMLImageElement>document.getElementById("symbol07"), 07 ) );
			stripSymbols.push( new darkgame.Symbol( <HTMLImageElement>document.getElementById("symbol08"), 08 ) );
			stripSymbols.push( new darkgame.Symbol( <HTMLImageElement>document.getElementById("symbol09"), 09 ) );
			stripSymbols.push( new darkgame.Symbol( <HTMLImageElement>document.getElementById("symbol10"), 10 ) );
			stripSymbols.push( new darkgame.Symbol( <HTMLImageElement>document.getElementById("symbol11"), 11 ) );
			stripSymbols.push( new darkgame.Symbol( <HTMLImageElement>document.getElementById("symbol12"), 12 ) );
			stripSymbols.push( new darkgame.Symbol( <HTMLImageElement>document.getElementById("symbol13"), 13 ) );
			stripSymbols.push( new darkgame.Symbol( <HTMLImageElement>document.getElementById("symbol14"), 14 ) );

			var strip: darkgame.ReelStrip = new darkgame.ReelStrip(stripSymbols);

			//TODO: Make more reels.
			this.reel = new darkgame.Reel(5, strip, 100, 100);

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
}

// boostrap
var game:darkgame.DarkGame = new darkgame.DarkGame();