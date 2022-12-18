import { css } from '@stitches/core'
import * as pressable from '@zag-js/pressable'
import { normalizeProps, useMachine } from '@zag-js/solid'
import { createMemo, createUniqueId } from 'solid-js'

const button = css({
	// base styles
	borderRadius: '4px',
	height: '2em',
	border: '1px solid #eee',
	outline: 'none',

	variants: {
		variant: {
			primary: {
				backgroundColor: 'white',
				fontSize: '1em',
			},
			secondary: {
				// secondary styles
			},
		},
	},
})

function Button() {
	const [state, send] = useMachine(
		pressable.machine({
			id: createUniqueId(),
			onPress() {
				console.log('press')
			},
			onLongPress() {
				console.log('long press')
			},
		})
	)

	const api = createMemo(() => pressable.connect(state, send, normalizeProps))

	return (
		<button class={button({ variant: 'primary' })} {...api().pressableProps}>
			{api().isPressed ? 'Pressed!' : 'Press Me'}
		</button>
	)
}

export default Button
