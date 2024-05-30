import Image from 'next/image'
import styles from './page.module.css'
import { MintAria, MintLuna, MintRyker, MintThaddeus } from './writeTransactions'
import GetTotalSupply from './readTransactions'

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
