import { Component, type ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from '@/lib/ThemeContext'
import { spacing } from '@/lib/theme'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

function ErrorFallback() {
  const { colors } = useTheme()
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.foreground }]}>Something went wrong</Text>
      <Text style={[styles.message, { color: colors.mutedForeground }]}>
        The app hit an unexpected error. Please close and reopen it.
      </Text>
    </View>
  )
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
  },
})
