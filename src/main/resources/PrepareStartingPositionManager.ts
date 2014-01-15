module darkgame
{
	export class PrepareStartingPositionManager implements darkgame.IPositionManager
	{
		private atPosition: number;
		private fromTime: number;
		private duration: number;
		private done:boolean;
		private doneCallback:(position: number, timestamp:number)=>void;

		constructor()
		{

		}

		public start(atPosition: number, fromTime:number, duration:number, doneCallback:(position: number, timestamp:number)=>void):void
		{
			console.log("starting stopped");

			this.doneCallback = doneCallback;
			this.atPosition = atPosition;
			this.fromTime = fromTime;
			this.duration = duration;
			this.done = false;
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
			var toTime:number = this.fromTime + this.duration;
			if (currentTime >= toTime)
			{
				this.doneCallback(this.getPosition(currentTime), currentTime);
			}
		}
	}
}