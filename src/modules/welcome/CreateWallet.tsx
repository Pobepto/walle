import React, { useMemo, useRef, useState } from 'react'
import { Box, Text } from 'ink'
import { Worker } from 'worker_threads'

import { Wallet } from '@ethersproject/wallet'
import { ROUTE, useNavigate } from '@routes'
import { Button, ButtonProps } from '@src/components'
import { InputBox, InputBoxProps } from '@src/components/InputBox'
import {
  Selection,
  SelectionZone,
  SelectionZoneProps,
} from '@src/components/SelectionZone'
import { TextButton, TextButtonProps } from '@src/components/TextButton'
import { numberInRange } from '@src/hooks'
import { useForm } from '@src/hooks'
import { useWalletStore } from '@src/store'
import { getDerivationPath } from '@src/utils'

const workerCode = `
  const { Wallet } = require('@ethersproject/wallet')
  const { parentPort, workerData } = require('worker_threads')

  const isMatchPattern = (address, pattern) => {
    if (!pattern.startsWith('0x')) {
      address = address.slice(2)
    }

    const regexp = pattern.replaceAll('*', '\\\\w{1,}')

    return new RegExp(regexp).test(address)
  }

  const step = 50
  let attempts = 0
  let wallet = Wallet.createRandom({
    path: workerData.path
  })

  while (!isMatchPattern(wallet.address, workerData.pattern)) {
    wallet = Wallet.createRandom({
      path: workerData.path
    })
    attempts++

    if (attempts >= step) {
      parentPort.postMessage({ attempts })
      attempts = 0
    }
  }

  parentPort.postMessage({ phrase: wallet.mnemonic.phrase })
`

const computeDifficulty = (pattern: string) => {
  const validChars = pattern.replace('0x', '').replace(/[^a-f0-9]/gi, '').length

  return validChars ? Math.pow(16, validChars) : 0
}

const computeProbability = (difficulty: number, attempts: number) => {
  return Math.round(10000 * (1 - Math.pow(1 - 1 / difficulty, attempts))) / 100
}

export const CreateWallet: React.FC = () => {
  const [wallet, setWallet] = useState(() => Wallet.createRandom())
  const createWallet = useWalletStore((store) => store.createWallet)
  const [generationInProgress, setGenerationInProgress] = useState(false)
  const { data, errors, isValid, register } = useForm({
    initialValues: {
      pattern: '',
      threads: '1',
      accountIndex: '0',
      addressIndex: '0',
    },
    rules: {
      threads: numberInRange(1, 32),
      accountIndex: numberInRange(0, 2147483647),
      addressIndex: numberInRange(0, 2147483647),
    },
  })
  const workers = useRef<Worker[]>([])
  const startTime = useRef(Date.now())
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [displayMnemonic, setPhraseVisibility] = useState(false)
  const [advanced, setAdvanced] = useState(false)
  const navigate = useNavigate()

  const { pattern, threads = '1' } = data

  const terminateWorkers = () => {
    workers.current.map((worker) => worker.terminate())
    workers.current = []
  }

  const regenerate = async () => {
    if (workers.current.length) {
      terminateWorkers()
      return
    }

    const path = getDerivationPath(
      Number(data.accountIndex),
      Number(data.addressIndex),
    )

    if (pattern && pattern.length && pattern !== '0x') {
      setGenerationInProgress(true)

      workers.current = [...Array(Number(threads))].map(
        () =>
          new Worker(workerCode, {
            eval: true,
            workerData: { pattern, path },
          }),
      )

      setTotalAttempts(0)
      startTime.current = Date.now()

      const phrase = await Promise.any(
        workers.current.map((worker) => {
          return new Promise<string | undefined>((resolve) => {
            worker.on('error', () => resolve(undefined))
            worker.on('exit', () => resolve(undefined))
            worker.on('message', ({ phrase, attempts }) => {
              if (phrase) {
                resolve(phrase)
              } else if (attempts) {
                setTotalAttempts((v) => v + attempts)
              }
            })
          })
        }),
      )

      terminateWorkers()

      if (phrase) {
        setWallet(Wallet.fromMnemonic(phrase, path))
      }

      setGenerationInProgress(false)
    } else {
      setWallet(Wallet.createRandom({ path }))
    }
  }

  const onCreateWallet = () => {
    createWallet(
      wallet.mnemonic.phrase,
      Number(data.accountIndex),
      Number(data.addressIndex),
    )
    navigate(ROUTE.REGISTRATION_PASSWORD)
  }

  const difficulty = computeDifficulty(pattern)
  const probability = computeProbability(difficulty, totalAttempts)
  const speed = useMemo(
    () => Math.floor((1000 * totalAttempts) / (Date.now() - startTime.current)),
    [totalAttempts],
  )
  const probability50 =
    Math.floor(Math.log(0.5) / Math.log(1 - 1 / difficulty)) || 0

  return (
    <Box
      flexDirection="column"
      width="100%"
      borderStyle="double"
      borderColor="cyan"
      paddingX={1}
    >
      <Box marginTop={-1}>
        <Text bold> Wallet Generator </Text>
      </Box>
      <Box flexDirection="column" alignItems="center">
        <SelectionZone prevKey="upArrow" nextKey="downArrow" isActive>
          <Selection<TextButtonProps> activeProps={{ isFocused: true }}>
            <TextButton onPress={() => setPhraseVisibility((v) => !v)}>
              {displayMnemonic ? 'Hide mnemonic' : 'Show mnemonic'}
            </TextButton>
          </Selection>

          <InputBox
            width="50%"
            onChange={() => null}
            value={
              displayMnemonic
                ? wallet.mnemonic.phrase
                : wallet.mnemonic.phrase
                    .split(' ')
                    .map((word) => '*'.repeat(word.length))
                    .join(' ')
            }
            disabled
          />

          <Text color="cyan">
            {generationInProgress ? `0x${'?'.repeat(32)}` : wallet.address}
          </Text>

          {advanced && (
            <>
              <Selection<InputBoxProps> activeProps={{ focus: true }}>
                <InputBox
                  label="Address pattern"
                  width="50%"
                  placeholder="0x*"
                  disabled={generationInProgress}
                  error={errors.pattern}
                  {...register('pattern')}
                />
              </Selection>
              <Selection<InputBoxProps> activeProps={{ focus: true }}>
                <InputBox
                  label="accountIndex"
                  width="50%"
                  type="number"
                  placeholder="0"
                  disabled={generationInProgress}
                  error={errors.accountIndex}
                  {...register('accountIndex')}
                />
              </Selection>
              <Selection<InputBoxProps> activeProps={{ focus: true }}>
                <InputBox
                  label="addressIndex"
                  width="50%"
                  type="number"
                  placeholder="0"
                  disabled={generationInProgress}
                  error={errors.addressIndex}
                  {...register('addressIndex')}
                />
              </Selection>
              <Selection<InputBoxProps> activeProps={{ focus: true }}>
                <InputBox
                  label="Threads"
                  width="50%"
                  type="number"
                  placeholder="1"
                  disabled={generationInProgress}
                  error={errors.threads}
                  {...register('threads')}
                />
              </Selection>
              <Box flexDirection="column" width="50%">
                <Text>Generated: {totalAttempts} addresses</Text>
                <Text>Speed: {speed} addr/s</Text>
                <Text>50% probability: {probability50} addresses</Text>
                <Text>Probability: {probability}%</Text>
              </Box>
            </>
          )}

          <Box>
            <Selection<SelectionZoneProps>
              activeProps={{ isActive: true }}
              selectedByDefault
            >
              <SelectionZone prevKey="leftArrow" nextKey="rightArrow">
                <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                  <Button onPress={navigate.back}>Back</Button>
                </Selection>
                {advanced ? (
                  <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                    <Button
                      minWidth="13"
                      onPress={regenerate}
                      isDisabled={!isValid}
                    >
                      <Text>
                        {generationInProgress ? 'Cancel' : 'Regenerate'}
                      </Text>
                    </Button>
                  </Selection>
                ) : (
                  <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                    <Button minWidth="13" onPress={() => setAdvanced(true)}>
                      Generation settings
                    </Button>
                  </Selection>
                )}
                <Selection<ButtonProps>
                  activeProps={{ isFocused: true }}
                  selectedByDefault
                >
                  <Button
                    minWidth="10"
                    onPress={onCreateWallet}
                    isDisabled={generationInProgress}
                  >
                    Save
                  </Button>
                </Selection>
              </SelectionZone>
            </Selection>
          </Box>
        </SelectionZone>
      </Box>
    </Box>
  )
}
