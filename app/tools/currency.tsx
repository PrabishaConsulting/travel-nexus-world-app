import { useQuery } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { useMemo, useState } from 'react'
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { ArrowUpDown } from 'lucide-react-native'
import { ErrorView, LoadingView } from '@/components/StateViews'
import { CURRENCIES } from '@/lib/currencies'
import { useI18n } from '@/lib/i18n/I18nContext'
import { useTheme } from '@/lib/ThemeContext'
import { radius, spacing } from '@/lib/theme'

async function fetchRates(base: string): Promise<Record<string, number>> {
  const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`)
  if (!res.ok) throw new Error('Could not fetch exchange rates')
  const data = await res.json()
  return data.rates
}

export default function CurrencyConverterScreen() {
  const { colors } = useTheme()
  const { t } = useI18n()
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('INR')
  const [pickerFor, setPickerFor] = useState<'from' | 'to' | null>(null)

  const { data: rates, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['exchange-rates', from],
    queryFn: () => fetchRates(from),
  })

  const converted = useMemo(() => {
    const amt = parseFloat(amount)
    if (!rates || isNaN(amt)) return null
    const rate = rates[to]
    if (!rate) return null
    return amt * rate
  }, [rates, amount, to])

  const fromCurrency = CURRENCIES.find((c) => c.code === from)!
  const toCurrency = CURRENCIES.find((c) => c.code === to)!
  const rate = rates?.[to]

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: t('account_currency') }} />

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>{t('currency_amount')}</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          style={[styles.amountInput, { color: colors.foreground }]}
        />

        <View style={styles.row}>
          <Pressable
            style={[styles.currencyButton, { backgroundColor: colors.muted }]}
            onPress={() => setPickerFor('from')}
          >
            <Text style={[styles.currencyCode, { color: colors.foreground }]}>
              {fromCurrency.symbol} {from}
            </Text>
            <Text style={[styles.currencyName, { color: colors.mutedForeground }]} numberOfLines={1}>
              {fromCurrency.name}
            </Text>
          </Pressable>

          <Pressable
            style={styles.swapButton}
            onPress={() => {
              setFrom(to)
              setTo(from)
            }}
          >
            <ArrowUpDown color={colors.primary} size={20} />
          </Pressable>

          <Pressable
            style={[styles.currencyButton, { backgroundColor: colors.muted }]}
            onPress={() => setPickerFor('to')}
          >
            <Text style={[styles.currencyCode, { color: colors.foreground }]}>
              {toCurrency.symbol} {to}
            </Text>
            <Text style={[styles.currencyName, { color: colors.mutedForeground }]} numberOfLines={1}>
              {toCurrency.name}
            </Text>
          </Pressable>
        </View>

        {isLoading ? (
          <LoadingView />
        ) : isError ? (
          <ErrorView message={(error as Error)?.message} onRetry={refetch} />
        ) : converted !== null ? (
          <View style={[styles.resultBox, { borderTopColor: colors.border }]}>
            <Text style={[styles.resultValue, { color: colors.primary }]}>
              {toCurrency.symbol} {converted.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </Text>
            {rate ? (
              <Text style={[styles.rateText, { color: colors.mutedForeground }]}>
                1 {from} = {rate.toFixed(4)} {to}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>

      <Modal visible={pickerFor !== null} animationType="slide" onRequestClose={() => setPickerFor(null)}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>{t('currency_select')}</Text>
          <FlatList
            data={CURRENCIES}
            keyExtractor={(c) => c.code}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.modalItem, { borderBottomColor: colors.border }]}
                onPress={() => {
                  if (pickerFor === 'from') setFrom(item.code)
                  else if (pickerFor === 'to') setTo(item.code)
                  setPickerFor(null)
                }}
              >
                <Text style={[styles.modalItemSymbol, { color: colors.secondary }]}>{item.symbol}</Text>
                <View>
                  <Text style={[styles.modalItemCode, { color: colors.foreground }]}>{item.code}</Text>
                  <Text style={[styles.modalItemName, { color: colors.mutedForeground }]}>{item.name}</Text>
                </View>
              </Pressable>
            )}
          />
          <Pressable style={styles.closeButton} onPress={() => setPickerFor(null)}>
            <Text style={[styles.closeButtonText, { color: colors.primary }]}>{t('action_close')}</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '800',
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  currencyButton: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '700',
  },
  currencyName: {
    fontSize: 11,
    marginTop: 2,
  },
  swapButton: {
    padding: spacing.sm,
  },
  resultBox: {
    marginTop: spacing.xl,
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
  },
  resultValue: {
    fontSize: 30,
    fontWeight: '800',
  },
  rateText: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  modalItemSymbol: {
    fontSize: 20,
    width: 36,
    textAlign: 'center',
  },
  modalItemCode: {
    fontSize: 15,
    fontWeight: '700',
  },
  modalItemName: {
    fontSize: 12,
  },
  closeButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: '700',
    fontSize: 15,
  },
})
