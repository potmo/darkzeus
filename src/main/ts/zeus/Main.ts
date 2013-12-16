module zeus
{
	export class Main
	{

		private partnerAdapter: partneradapterapi.IPartnerAdapter;
		private gameBackground: HTMLDivElement;

		constructor()
		{
			this.partnerAdapter = (new partneradapterapi.PartnerAdapterFactory()).createPartnerAdapter();

			this.partnerAdapter.hideProgressBar();

			this.gameBackground = this.partnerAdapter.getGameBackgroundImageElement();
			this.cycleBgColor(1000, true);
		}
		
		private cycleBgColor(delay: number, black: boolean): void {
			var colorStr: string = "#FF0000";
			if (black) {
				colorStr = "#000000";
			}
			this.gameBackground.style.background = colorStr;
			
			setTimeout(() => this.cycleBgColor(delay, !black), delay);
		}
	}
}
