import styles from './language-switch.module.css';

type LanguageSwitchProps = {
  current: 'en' | 'bn';
  onChange: (lang: 'en' | 'bn') => void;
  englishLabel?: string;
  banglaLabel?: string;
  ariaLabel?: string;
};

export function LanguageSwitch({
  current,
  onChange,
  englishLabel = "English",
  banglaLabel = "বাংলা",
  ariaLabel = "Language selection",
}: LanguageSwitchProps) {
  return (
    <div className={styles.group} role="group" aria-label={ariaLabel}>
      <button
        type="button"
        onClick={() => onChange('en')}
        className={`${styles.button} ${current === 'en' ? styles.active : ''}`}
        aria-pressed={current === 'en'}
      >
        {englishLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange('bn')}
        className={`${styles.button} ${current === 'bn' ? styles.active : ''}`}
        aria-pressed={current === 'bn'}
      >
        {banglaLabel}
      </button>
    </div>
  );
}
