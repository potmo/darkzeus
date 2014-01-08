module darkgame
{
	export class StartingPositionManager implements darkgame.IPositionManager
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
}