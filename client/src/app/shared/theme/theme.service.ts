import { DOCUMENT } from '@angular/common';
import { Injectable, RendererFactory2, effect, inject, signal } from '@angular/core';
import Cookies from 'js-cookie';
import { THEME_COOKIE_KEY } from './theme.config';
import { Theme } from './theme.types';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  #renderer = inject(RendererFactory2).createRenderer(null, null);

  #document = inject(DOCUMENT);

  #theme = signal<Theme>(this.#getStorage() ?? this.#getDefault());

  theme = this.#theme.asReadonly();

  constructor() {
    effect(() => {
      const theme = this.#theme();
      this.#applyTheme(theme);
      this.#setStorage(theme);
    });
  }

  switch(theme?: Theme) {
    this.#theme.update((_theme) => ((theme ?? _theme === 'light') ? 'dark' : 'light'));
  }

  #applyTheme(theme: Theme) {
    this.#renderer[theme === 'light' ? 'removeClass' : 'addClass'](this.#document.body, 'gbl-theme-dark');
  }

  #getStorage() {
    return Cookies.get(THEME_COOKIE_KEY) as Theme | undefined;
  }

  #setStorage(theme: Theme) {
    Cookies.set(THEME_COOKIE_KEY, theme);
  }

  #getDefault(): Theme {
    return this.#document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
