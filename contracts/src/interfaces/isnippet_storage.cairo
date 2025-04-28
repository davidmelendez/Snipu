use starknet::ContractAddress;

#[starknet::interface]
pub trait ISnippetStorage<TContractState> {
    fn store_snippet(ref self: TContractState, snippet_hash: felt252);
    fn get_snippet(self: @TContractState, user: ContractAddress) -> felt252;
    fn get_snippet_by_id(self: @TContractState, snippet_id: felt252) -> felt252;
    fn add_snippet(ref self: TContractState, snippet_id: felt252, snippet: felt252);
    fn remove_snippet(ref self: TContractState, snippet_id: felt252);
    fn update_snippet(ref self: TContractState, snippet_id: felt252, new_snippet: felt252);
}
