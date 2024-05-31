import Image from 'next/image'
import styles from './page.module.css'
import GetTotalSupply from './readTransactions'
import { MintAria, MintLuna, MintRyker, MintThaddeus } from './writeTransactions'
import ThirdWeb from './thirdweb'

export default function Home() {
  return (
    <main className={styles.main}>
      total Supply
      <GetTotalSupply />

      Aria
      <MintAria></MintAria>
      Luna
      <MintLuna></MintLuna>
      Ryker
      <MintRyker></MintRyker>
      Thaddeus
      <MintThaddeus></MintThaddeus>
    </main>

  )
}
