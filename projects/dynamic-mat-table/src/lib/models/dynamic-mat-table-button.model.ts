export interface Icon {
  name: string;
  color: 'default' | 'primary' | 'accent' | 'warn' | 'emphasis' | 'error' | 'success' | 'info';
  size?: string;
}

export type ButtonIcon = {
  icon: Icon;
  position: 'before' | 'after';
}
export class DynamicMatTableButton {
  readonly buttonType = 'button';
  constructor(
    readonly buttonText: string,
    readonly buttonColor: 'default' | 'primary' | 'accent' | 'warn' | 'emphasis' | 'error' | 'success' | 'info' = 'default'
  ) {
    this.buttonText = buttonText;
    this.buttonColor = buttonColor;
  }
}

export class DynamicMatTableLabeledButton {
  readonly buttonType = 'labeled';
  constructor(
    readonly buttonText: string,
    readonly buttonIcon: ButtonIcon,
    readonly buttonColor: 'default' | 'primary' | 'accent' | 'warn' | 'emphasis' | 'error' | 'success' | 'info' = "default"
  ) {
    this.buttonText = buttonText;
    this.buttonIcon = buttonIcon;
    this.buttonColor = buttonColor;
  }
}

