module darkgame
{
	export class RunningPositionManager implements darkgame.IPositionManager
	{
		private fromPosition:number;
		private fromTime:number;
		private velocity:number;
		private done:boolean;
		private doneCallback:(position: number, timestamp:number, velocity:number)=>void;
		
		constructor()
		{
		}

		public start(fromPosition: number, fromTime:number, velocity:number):void
		{
			console.log("starting running");

			this.fromPosition = fromPosition;
			this.fromTime = fromTime;
			this.velocity = velocity;
			this.done = false;
		}

		public stop(doneCallback:(position: number, timestamp:number, velocity:number)=>void):void
		{
			this.doneCallback = doneCallback;
			this.done = true;
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
				var currentPositon: number = this.getPosition(currentTime);
				var currentVelocity:number = this.getVelocity(currentTime);
				this.doneCallback(currentPositon, currentTime, currentVelocity);
			}
		}
	}
}