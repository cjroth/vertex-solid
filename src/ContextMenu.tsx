import * as menu from '@zag-js/menu'
import { normalizeProps, useMachine } from '@zag-js/solid'
import { createMemo, createUniqueId } from 'solid-js'

function ContextMenu({ children }) {
	const [state, send] = useMachine(
		menu.machine({
			id: createUniqueId(),
			'aria-label': 'File',
		})
	)

	const api = createMemo(() => menu.connect(state, send, normalizeProps))

	return (
		<div>
			<div {...api().contextTriggerProps}>
				<div style={{ border: 'solid 1px red' }}>{children}</div>
			</div>
			<div {...api().positionerProps}>
				<ul {...api().contentProps}>
					<li {...api().getItemProps({ id: 'edit' })}>Edit</li>
					<li {...api().getItemProps({ id: 'duplicate' })}>Duplicate</li>
					<li {...api().getItemProps({ id: 'delete' })}>Delete</li>
					<li {...api().getItemProps({ id: 'export' })}>Export...</li>
				</ul>
			</div>
		</div>
	)
}

export default ContextMenu
