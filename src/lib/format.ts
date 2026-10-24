const naira = new Intl.NumberFormat('en-NG', {
	style: 'currency',
	currency: 'NGN',
	maximumFractionDigits: 0
});

export const formatNaira = (amount: number) => naira.format(amount);

export const formatDate = (iso: string) =>
	iso
		? new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(
				new Date(iso.replace(' ', 'T'))
			)
		: '—';
