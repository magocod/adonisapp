/**
 *
 */
export interface ModelValidationResult<I> {
	is_valid: boolean;
	data: I;
	messages: any[];
	exception: any;
}
