<script lang="ts">
	let { dismissed }: { dismissed: boolean } = $props();

	// The cookie only decides the starting state; dismissing updates it locally.
	// svelte-ignore state_referenced_locally
	let visible = $state(!dismissed);

	function dismiss() {
		visible = false;
		try {
			document.cookie = 'hero=dismissed; path=/; max-age=31536000; samesite=lax';
		} catch {
			// cookies unavailable; the intro simply returns on reload
		}
	}
</script>

{#if visible}
	<section class="relative pt-14 pb-6 sm:pt-28 sm:pb-12">
		<button
			type="button"
			class="absolute top-5 right-0 eyebrow underline-offset-4 hover:text-foreground hover:underline sm:top-8"
			aria-label="Dismiss intro"
			onclick={dismiss}
		>
			Dismiss
		</button>

		<p class="mb-8 eyebrow sm:mb-10">Nigerian Law School</p>
		<div class="flex flex-wrap items-end justify-between gap-x-20 gap-y-8">
			<h1 class="max-w-[12ch] display text-[clamp(2.9rem,7.8vw,6.6rem)]">
				Books &amp; essentials for the Bar.
			</h1>
			<p class="max-w-[34ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
				Course texts, practice manuals and Law School apparel, delivered to your door. Order as a
				guest or with an account.
			</p>
		</div>
	</section>
{/if}
