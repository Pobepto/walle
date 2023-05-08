/* eslint-disable no-useless-escape */
import React, { useRef, useState } from 'react'
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

type Inputs = {
  pattern: string
  threads: string
}

const calculateDifficulty = (pattern: string) => {
  if (!pattern) {
    return 0
  }

  if (pattern.startsWith('0x')) {
    pattern = pattern.slice(2)
  }

  const uniqueChars = pattern.replace(/[^a-f0-9]/gi, '').length

  return uniqueChars === 0 ? 0 : Math.pow(16, uniqueChars)
}

export const CreateWallet: React.FC = () => {
  const [wallet, setWallet] = useState(() => Wallet.createRandom())
  const [generationInProgress, setGenerationInProgress] = useState(false)
  const { data, errors, isValid, register } = useForm<Inputs>({
    initialValues: {
      threads: '1',
    },
    rules: {
      threads: numberInRange(1, Infinity),
    },
  })
  const workers = useRef<Worker[]>([])
  const [displayPhrase, setPhraseVisibility] = useState(false)
  const [advanced, setAdvanced] = useState(false)
  const navigate = useNavigate()

  const { pattern, threads = '1' } = data

  const terminate = () => {
    workers.current.map((worker) => worker.terminate())
    workers.current = []
  }

  const regenerate = async () => {
    if (workers.current.length) {
      terminate()
      return
    }

    if (pattern && pattern.length) {
      setGenerationInProgress(true)

      workers.current = [...Array(Number(threads))].map(
        () =>
          new Worker(
            `
          const { Wallet } = require('@ethersproject/wallet')
          const { parentPort, workerData } = require('worker_threads')
          
          const isMatchPattern = (address, pattern) => {
            if (!pattern.startsWith('0x')) {
              address = address.slice(2)
            }
          
            const regexp = pattern.replaceAll('*', '\\\\w{1,}')
          
            return new RegExp(regexp).test(address)
          }
          
          let wallet = Wallet.createRandom()
        
          while (!isMatchPattern(wallet.address, workerData.pattern)) {
            wallet = Wallet.createRandom()
          }

          parentPort.postMessage({ phrase: wallet.mnemonic.phrase })
        `,
            {
              eval: true,
              workerData: { pattern },
            },
          ),
      )

      const { phrase } = await Promise.race(
        workers.current.map((worker) => {
          return new Promise<{ phrase?: string }>((resolve) => {
            worker.on('error', () => resolve({}))
            worker.on('message', resolve)
            worker.on('exit', () => resolve({}))
          })
        }),
      )

      terminate()

      if (phrase) {
        setWallet(Wallet.fromMnemonic(phrase))
      }

      setGenerationInProgress(false)
    } else {
      setWallet(Wallet.createRandom())
    }
  }

  const difficulty = calculateDifficulty(pattern)

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
              {displayPhrase ? 'Hide mnemonic' : 'Show mnemonic'}
            </TextButton>
          </Selection>

          <InputBox
            width="50%"
            onChange={() => null}
            value={
              displayPhrase
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
                  {...register('pattern')}
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
                <Text>Difficulty: {difficulty}</Text>
                <Text>
                  50% probability:{' '}
                  {Math.floor(Math.log(0.5) / Math.log(1 - 1 / difficulty)) ||
                    0}{' '}
                  addresses
                </Text>
              </Box>
            </>
          )}

          <Box>
            <Selection<SelectionZoneProps>
              activeProps={{ isActive: true }}
              selectedByDefault
            >
              <SelectionZone
                prevKey="leftArrow"
                nextKey="rightArrow"
                defaultSelection={1}
              >
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
                      Advanced generation
                    </Button>
                  </Selection>
                )}
                <Selection<ButtonProps> activeProps={{ isFocused: true }}>
                  <Button
                    onPress={() => navigate(ROUTE.REGISTRATION_PASSWORD)}
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
