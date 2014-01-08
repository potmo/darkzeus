module darkgame
{
	export class StoppingPositionManager implements darkgame.IPositionManager
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
}