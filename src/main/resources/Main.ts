module darkgame
{
	export class DarkGame
	{
		private reel0: darkgame.Reel;
		private reel1: darkgame.Reel;
		private reel2: darkgame.Reel;
		private reel3: darkgame.Reel;
		private reel4: darkgame.Reel;

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
			this.reel0 = new darkgame.Reel(5, strip, 100, 100);
			this.reel1 = new darkgame.Reel(5, strip, 200, 100);
			this.reel2 = new darkgame.Reel(5, strip, 300, 100);
			this.reel3 = new darkgame.Reel(5, strip, 400, 100);
			this.reel4 = new darkgame.Reel(5, strip, 500, 100);

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
			this.reel0.start(0);
			this.reel1.start(50);
			this.reel2.start(100);
			this.reel3.start(150);
			this.reel4.start(200);

			// simulate some connection and then stop
			window.setTimeout(()=>{
				this.reel0.stop(0, 1);
				this.reel1.stop(1, 2);
				this.reel2.stop(2, 3);
				this.reel3.stop(3, 10);
				this.reel4.stop(4, 11);
			}, 3000);
		}


		private mainLoop(timestamp:number, lastFrameTimestamp:number, context: CanvasRenderingContext2D ):void
		{

			context.fillStyle = "#FFFFFF";
			context.fillRect(0,0,800,600);

			var timeDelta: number = timestamp - lastFrameTimestamp;
			var speedMultiplier: number = timeDelta / (1000 / 60); // 60 FPS is perfect

			this.reel0.update(timestamp);
			this.reel1.update(timestamp);
			this.reel2.update(timestamp);
			this.reel3.update(timestamp);
			this.reel4.update(timestamp);

			this.reel0.render(context);
			this.reel1.render(context);
			this.reel2.render(context);
			this.reel3.render(context);
			this.reel4.render(context);

			lastFrameTimestamp = timestamp;
			window.requestAnimationFrame((timestamp)=>this.mainLoop(timestamp, lastFrameTimestamp, context));
		}

	}
}
