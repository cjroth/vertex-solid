import { HopeProvider, Select, SelectContent, SelectIcon, SelectListbox, SelectOption, SelectOptionIndicator, SelectOptionText, SelectPlaceholder, SelectTrigger, SelectValue } from '@hope-ui/solid'
import { createMousePosition } from '@solid-primitives/mouse'
import { createElementSize } from '@solid-primitives/resize-observer'
import { createVirtualizer } from '@tanstack/solid-virtual'
import { createEffect, createMemo, createSignal, For, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'

const rowCount = 10000000

const initialRows = new Map<number, boolean>()

const columns = new Array(50).fill(true).map(() => 75 + Math.round(Math.random() * 100))

function TableView() {
	return (
		<HopeProvider>
			<GridVirtualizerVariable rows={initialRows} columns={columns} />
		</HopeProvider>
	)
}

const [state, setState] = createStore({
	rows: initialRows,
	mousePosition: null,
})

const loadPage = (start: number) => {
	setTimeout(() => {
		setState(
			'rows',
			(rows: Map<number, boolean>) => {
				for (let i = start; i < start + 50; i++) {
					rows.set(i, true)
				}
				return rows
			},
			true
		)
	}, 1000)
}

function Cell({ x, y }) {
	onMount(() => {
		if (!state.rows.get(y)) {
			loadPage(y)
		}
	})

	const isHovering = createMemo(() => state.mousePosition?.x === x && state.mousePosition?.y === y)

	return (
		<div style={{ flex: 1, background: isHovering() ? 'blue' : 'transparent' }}>
			{x} {y} {state.rows.get(y)?.toString()}
		</div>
	)

	return (
		<>
			<Select multiple>
				<SelectTrigger>
					<SelectPlaceholder>Choose some frameworks</SelectPlaceholder>
					<SelectValue />
					<SelectIcon />
				</SelectTrigger>
				<SelectContent>
					<SelectListbox>
						<For each={['React', 'Angular', 'Vue', 'Svelte', 'Solid']}>
							{(item) => (
								<SelectOption value={item}>
									<SelectOptionText>{item}</SelectOptionText>
									<SelectOptionIndicator />
								</SelectOption>
							)}
						</For>
					</SelectListbox>
				</SelectContent>
			</Select>
		</>
	)
}

function GridVirtualizerVariable({ initialRows, columns }) {
	let parentRef
	const [target, setTarget] = createSignal<HTMLElement>()

	const rowVirtualizer = createVirtualizer({
		count: rowCount,
		getScrollElement: () => parentRef,
		estimateSize: (i) => 50,
		overscan: 20,
	})

	const columnVirtualizer = createVirtualizer({
		horizontal: true,
		count: columns.length,
		getScrollElement: () => parentRef,
		estimateSize: (i) => columns[i],
		overscan: 20,
	})

	const size = createElementSize(target)
	const pos = createMousePosition(target)

	createEffect(() => {
		const totalYOffset = rowVirtualizer.scrollOffset + pos.y
		const yIndex = Math.floor(totalYOffset / 50)

		const totalXOffset = columnVirtualizer.scrollOffset + pos.x
		const xIndex = columnVirtualizer.getMeasurements().find((c) => c.end > totalXOffset).index

		// console.log(pos.x, pos.y)
		// console.log(xIndex, yIndex)
		setState('mousePosition', { x: xIndex, y: yIndex })
	})

	return (
		<div ref={setTarget} style={{ width: '100vw', height: '100vh' }}>
			<div
				ref={parentRef}
				class="List"
				style={{
					height: (size.height || 100) + 'px',
					width: (size.width || 100) + 'px',
					overflow: 'auto',
				}}
			>
				<div
					style={{
						height: `${rowVirtualizer.getTotalSize()}px`,
						width: `${columnVirtualizer.getTotalSize()}px`,
						position: 'relative',
					}}
				>
					{rowVirtualizer.getVirtualItems().map((virtualRow) => (
						<>
							{columnVirtualizer.getVirtualItems().map((virtualColumn) => (
								<div
									class={virtualColumn.index % 2 ? (virtualRow.index % 2 === 0 ? 'ListItemOdd' : 'ListItemEven') : virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: `${columns[virtualColumn.index]}px`,
										height: `50px`,
										transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
									}}
								>
									<Cell x={virtualColumn.index} y={virtualRow.index} />
								</div>
							))}
						</>
					))}
				</div>
			</div>
		</div>
	)
}

export default TableView
