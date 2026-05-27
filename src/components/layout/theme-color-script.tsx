import {
  DEFAULT_THEME_COLOR,
  THEME_COLOR_STORAGE_KEY,
} from '@/styles/theme-colors'

export function ThemeColorScript() {
  const code = `(function(){try{var raw=localStorage.getItem(${JSON.stringify(THEME_COLOR_STORAGE_KEY)});var c=${JSON.stringify(DEFAULT_THEME_COLOR)};if(raw){var p=JSON.parse(raw);if(p&&p.state&&typeof p.state.color==='string'){c=p.state.color;}}document.documentElement.setAttribute('data-theme-color',c);}catch(e){}})();`
  return <script dangerouslySetInnerHTML={{ __html: code }} />
}
