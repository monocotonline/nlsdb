<script lang="ts">
	import { onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import {
		Heading02Icon,
		LeftToRightListBulletIcon,
		LeftToRightListNumberIcon,
		Link01Icon,
		QuoteDownIcon,
		Redo02Icon,
		TextBoldIcon,
		TextItalicIcon,
		TextUnderlineIcon,
		Undo02Icon
	} from '@hugeicons/core-free-icons';
	import type { IconSvgElement } from '@hugeicons/svelte';
	import Icon from '#lib/components/icon.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { cn } from '#lib/utils.js';

	let {
		value = $bindable(''),
		name = 'description',
		placeholder = 'Write a description…'
	}: { value?: string; name?: string; placeholder?: string } = $props();

	let element = $state<HTMLDivElement>();
	let editor = $state.raw<Editor>();
	// Bumped on every editor transaction so toolbar state (active/disabled) stays current.
	let tick = $state(0);

	onMount(() => {
		const instance = new Editor({
			element,
			content: value,
			extensions: [
				StarterKit.configure({
					heading: { levels: [2, 3] },
					code: false,
					codeBlock: false,
					strike: false,
					link: { openOnClick: false, autolink: true, defaultProtocol: 'https' }
				})
			],
			editorProps: {
				attributes: {
					// 16px on phones stops iOS from zooming the page when the editor is focused.
					class:
						'rich-text min-h-36 max-h-64 overflow-y-auto px-3.5 py-3 outline-none max-md:text-base sm:min-h-44 sm:max-h-80',
					'aria-label': 'Description',
					role: 'textbox',
					'aria-multiline': 'true'
				}
			},
			onUpdate: ({ editor: e }) => (value = e.getHTML()),
			onTransaction: () => tick++
		});
		editor = instance;
		return () => instance.destroy();
	});

	const active = (name: string, attrs?: Record<string, unknown>) => {
		void tick;
		return editor?.isActive(name, attrs) ?? false;
	};
	const can = (action: 'undo' | 'redo') => {
		void tick;
		return editor ? editor.can()[action]() : false;
	};
	const empty = $derived.by(() => {
		void tick;
		return editor?.isEmpty ?? !value;
	});

	function setLink() {
		if (!editor) return;
		const previous = editor.getAttributes('link').href as string | undefined;
		const url = window.prompt(
			'Link address (leave empty to remove the link)',
			previous ?? 'https://'
		);
		if (url === null) return;
		const chain = editor.chain().focus().extendMarkRange('link');
		if (url.trim() === '' || url.trim() === 'https://') chain.unsetLink().run();
		else chain.setLink({ href: url.trim() }).run();
	}

	type Tool = {
		label: string;
		icon: IconSvgElement;
		on: () => void;
		isActive?: () => boolean;
		disabled?: () => boolean;
	};
	const groups: Tool[][] = [
		[
			{
				label: 'Bold',
				icon: TextBoldIcon,
				on: () => editor?.chain().focus().toggleBold().run(),
				isActive: () => active('bold')
			},
			{
				label: 'Italic',
				icon: TextItalicIcon,
				on: () => editor?.chain().focus().toggleItalic().run(),
				isActive: () => active('italic')
			},
			{
				label: 'Underline',
				icon: TextUnderlineIcon,
				on: () => editor?.chain().focus().toggleUnderline().run(),
				isActive: () => active('underline')
			}
		],
		[
			{
				label: 'Heading',
				icon: Heading02Icon,
				on: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
				isActive: () => active('heading', { level: 2 })
			},
			{
				label: 'Bulleted list',
				icon: LeftToRightListBulletIcon,
				on: () => editor?.chain().focus().toggleBulletList().run(),
				isActive: () => active('bulletList')
			},
			{
				label: 'Numbered list',
				icon: LeftToRightListNumberIcon,
				on: () => editor?.chain().focus().toggleOrderedList().run(),
				isActive: () => active('orderedList')
			},
			{
				label: 'Quote',
				icon: QuoteDownIcon,
				on: () => editor?.chain().focus().toggleBlockquote().run(),
				isActive: () => active('blockquote')
			},
			{ label: 'Link', icon: Link01Icon, on: setLink, isActive: () => active('link') }
		],
		[
			{
				label: 'Undo',
				icon: Undo02Icon,
				on: () => editor?.chain().focus().undo().run(),
				disabled: () => !can('undo')
			},
			{
				label: 'Redo',
				icon: Redo02Icon,
				on: () => editor?.chain().focus().redo().run(),
				disabled: () => !can('redo')
			}
		]
	];
</script>

<div
	class="overflow-hidden rounded-md border border-input bg-background transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"
>
	<div class="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 p-1.5">
		{#each groups as group, g (g)}
			{#if g > 0}<span class="mx-1 h-5 w-px bg-border" aria-hidden="true"></span>{/if}
			{#each group as tool (tool.label)}
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					aria-label={tool.label}
					title={tool.label}
					aria-pressed={tool.isActive ? tool.isActive() : undefined}
					disabled={tool.disabled?.() ?? !editor}
					onclick={tool.on}
					class={cn(tool.isActive?.() && 'bg-accent text-accent-foreground')}
				>
					<Icon icon={tool.icon} size={16} strokeWidth={2} />
				</Button>
			{/each}
		{/each}
	</div>

	<div class="relative">
		<div bind:this={element}></div>
		{#if empty}
			<p class="pointer-events-none absolute top-3 left-3.5 text-sm text-muted-foreground">
				{placeholder}
			</p>
		{/if}
	</div>
</div>

<input type="hidden" {name} {value} />
