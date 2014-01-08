module darkgame
{
	export class RunningPositionManager implements darkgame.IPositionManager
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
}