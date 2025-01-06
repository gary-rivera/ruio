import { useRuioContext } from '@root/context/RuioContextProvider'
import styles from '../../styles/UIStylingRadioSelect.module.css'

export default function UIStylingRadioSelect() {
  const { ruioEnabled, setRuioEnabled } = useRuioContext()
  return (
    <>
      <input
        className={styles.radioInput}
        type="radio"
        id="css-prop-outline"
        name="css-prop"
        value="outline"
        defaultChecked
      />
      <label className={styles.radioLabel} htmlFor="css-prop-outline">
        Outline
      </label>

      <input
        className={styles.radioInput}
        type="radio"
        id="css-prop-border"
        name="css-prop"
        value="border"
      />
      <label className={`${styles.radioLabel}`} htmlFor="css-prop-border">
        Border
      </label>
    </>
  )
}
