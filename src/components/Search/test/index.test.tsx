import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe } from 'node:test';
import SearchInput, { SearchInputProps, SearchInputRef } from '..';

jest.mock('../../../hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
}));

describe('SearchInput Component', () => {
  const onSearchMock = jest.fn();
  const onResetMock = jest.fn();

  const renderComponent = (props: Partial<SearchInputProps> = {}, ref?: React.Ref<SearchInputRef>) =>
    render(
      <SearchInput
        onSearch={onSearchMock}
        ref={ref}
        {...props}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with default placeholder', () => {
      renderComponent();
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      renderComponent({ placeholder: 'Find items...' });
      expect(screen.getByPlaceholderText('Find items...')).toBeInTheDocument();
    });

    it('renders with label when provided', () => {
      renderComponent({ label: 'Search Label' });
      expect(screen.getByText('Search Label')).toBeInTheDocument();
    });

    it('does not render label when not provided', () => {
      renderComponent();
      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('applies custom className and containerClassName', () => {
      renderComponent({ className: 'custom-input', containerClassName: 'custom-container' });
      const outerContainer = screen.getByRole('textbox').closest('.custom-container');
      expect(outerContainer).toHaveClass('custom-container');
      expect(screen.getByRole('textbox')).toHaveClass('custom-input');
    });

    it('renders search icon', () => {
      renderComponent();
      const searchIcon = screen.getByRole('textbox').parentElement?.querySelector('svg');
      expect(searchIcon).toBeInTheDocument();
    });
  });

  describe('Default Value and Initial Search', () => {
    it('triggers search with default value after user interaction', () => {
      renderComponent({ defaultValue: 'hello' });
      const input = screen.getByRole('textbox');
      
      // Simulate user interaction
      fireEvent.change(input, { target: { value: 'hello world' } });
      expect(onSearchMock).toHaveBeenCalledWith('hello world');
    });
  });

  describe('Search Functionality', () => {
    it('calls onSearch when typing', () => {
      renderComponent();
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'test' } });
      expect(onSearchMock).toHaveBeenCalledWith('test');
    });

    it('calls onSearch for empty value after user interaction', () => {
      renderComponent();
      const input = screen.getByRole('textbox');

      // First interaction
      fireEvent.change(input, { target: { value: 'test' } });
      expect(onSearchMock).toHaveBeenCalledWith('test');
      
      // Clear the input
      fireEvent.change(input, { target: { value: '' } });
      expect(onSearchMock).toHaveBeenCalledWith('');
      expect(onSearchMock).toHaveBeenCalledTimes(2);
    });

    it('handles multiple input changes', () => {
      renderComponent();
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'abc' } });
      fireEvent.change(input, { target: { value: 'abcd' } });
      expect(onSearchMock).toHaveBeenCalledTimes(2);
      expect(onSearchMock).toHaveBeenLastCalledWith('abcd');
    });
  });

  describe('Clear Button Functionality', () => {
    it('does not show clear button when input is empty', () => {
      renderComponent();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('shows clear button when input has value', () => {
      renderComponent({ defaultValue: 'test' });
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows clear button after typing', () => {
      renderComponent();
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'test' } });
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('clears input when clear button is clicked', () => {
      renderComponent();
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'test' } });
      const clearButton = screen.getByRole('button');
      fireEvent.click(clearButton);
      
      expect(input).toHaveValue('');
    });

    it('calls onSearch with empty string when clear button is clicked', () => {
      renderComponent();
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'test' } });
      const clearButton = screen.getByRole('button');
      fireEvent.click(clearButton);
      
      expect(onSearchMock).toHaveBeenLastCalledWith('');
    });

    it('calls onReset when clear button is clicked and onReset is provided', () => {
      renderComponent({ onReset: onResetMock });
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'test' } });
      const clearButton = screen.getByRole('button');
      fireEvent.click(clearButton);
      
      expect(onResetMock).toHaveBeenCalledTimes(1);
    });

    it('does not call onReset when clear button is clicked and onReset is not provided', () => {
      renderComponent();
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'test' } });
      const clearButton = screen.getByRole('button');
      fireEvent.click(clearButton);
      
      // Should not throw error
      expect(onSearchMock).toHaveBeenCalled();
    });

    it('hides clear button after clearing', () => {
      renderComponent();
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'test' } });
      const clearButton = screen.getByRole('button');
      fireEvent.click(clearButton);
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('User Interaction Tracking', () => {

    it('triggers onSearch after first user interaction', () => {
      renderComponent({ defaultValue: 'test' });
      const input = screen.getByRole('textbox');
      
      // First user interaction
      fireEvent.change(input, { target: { value: 'test modified' } });
      expect(onSearchMock).toHaveBeenCalledWith('test modified');
    });
  });

  describe('Component Structure', () => {
    it('has correct container structure with label', () => {
      renderComponent({ label: 'Test Label' });
      const container = screen.getByText('Test Label').parentElement;
      expect(container).toHaveClass('space-y-2');
    });

    it('has correct input styling', () => {
      renderComponent();
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pl-9', 'pr-9');
    });

    it('positions clear button correctly when visible', () => {
      renderComponent({ defaultValue: 'test' });
      const clearButton = screen.getByRole('button');
      expect(clearButton).toHaveClass('absolute', 'right-3');
    });
  });
});