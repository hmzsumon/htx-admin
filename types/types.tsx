export interface Package {
	_id: number;
	title: string;
	price: number;
	profit_day: string;
	weekly: string;
	return: string;
	total_return: number;
	profit_percent: number;
}

// myPackage interface
export interface MyPackage {
	_id: string;
	p_title: string;
	sub_title: string;
	p_price: number;
	p_return: number;
	p_duration: string;
	is_active: boolean;
	is_expired: boolean;
	profit: number;

	to_day_profit: number;
	active_date: Date;
	expire_date: any;
	profit_day: string;
	weekly: string;
	return: string;
	total_return: number;
	createdAt: string;
	updatedAt: string;
}
