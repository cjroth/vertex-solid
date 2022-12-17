import { createElementSize } from '@solid-primitives/resize-observer'
import { createEffect } from 'solid-js'

export const Autosizer = ({ children, parentRef, ...rest }) => {
	const size = createElementSize(parentRef)
	createEffect(() => {
		size.width // => number | null
		size.height // => number | null
	})

	return <>{children(size)}</>
}
