import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar-photo',
  templateUrl: './avatar-photo.component.html',
  styleUrls: ['./avatar-photo.component.scss'],
  standalone: true,
  imports: [NgStyle, NgIf, NgClass],
})
export class AvatarPhotoComponent implements OnInit {
  @Input()
  public photoUrl?: string;

  @Input()
  public name!: string;

  @Input()
  public size?: 'small' | 'normal' = 'normal'

  public showInitials = false;
  public initials!: string;
  public circleColor!: string;

  private colors = [
    '#EB7181', // red
    '#468547', // green
    '#FFD558', // yellow
    '#3670B2', // blue
  ];

  generateHSL = (name: string) => {
    const hRange = [0, 360];
    const sRange = [0, 100];
    const lRange = [0, 100];

    const getHashOfString = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      hash = Math.abs(hash);
      return hash;
    };

    const hash = getHashOfString(name);
    const normalizeHash = (hash: number, min: number, max: number) => {
      return Math.floor((hash % (max - min)) + min);
    };
    const h = normalizeHash(hash, hRange[0], hRange[1]);
    const s = normalizeHash(hash, sRange[0], sRange[1]);
    const l = normalizeHash(hash, lRange[0], lRange[1]);
    return `hsl(${h}, ${s}%, ${l}%)`;
  };


  ngOnInit() {
    if (!this.photoUrl) {
      this.showInitials = true;
      this.createInititals();

      this.circleColor = this.generateHSL(this.name)
    }
  }

  private createInititals(): void {
    let initials = '';

    for (let i = 0; i < this.name.length; i++) {
      if (this.name.charAt(i) === ' ') {
        continue;
      }

      if (this.name.charAt(i) === this.name.charAt(i).toUpperCase()) {
        initials += this.name.charAt(i);

        if (initials.length == 2) {
          break;
        }
      }
    }

    this.initials = initials;
  }
}
