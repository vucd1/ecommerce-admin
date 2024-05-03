// This page is only used to trigger the store modal.

'use client';

import { useEffect } from 'react';
import { useStoreModal } from '@/hooks/use-store-modal';


const SetupPage = () => {

  const {onOpen, isOpen} = useStoreModal((state) => ({
    onOpen: state.onOpen, 
    isOpen: state.isOpen
  }));

  // useEffect hook runs after initial render of the component.
  // If the store modal is closed, then open it.
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, 
  // The effect will re-run whenever isOpen or onOpen changes.
  // This ensures the modal opens if it's not already open.
  [isOpen, onOpen]);
  
  return null;
}

export default SetupPage;