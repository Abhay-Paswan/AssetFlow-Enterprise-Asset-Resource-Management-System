import React from 'react';
import AssetDirectory from '../../../modules/assets/components/AssetDirectory';
import TransferApprovals from '../../../modules/assets/components/TransferApprovals';

export default function AssetsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <TransferApprovals />
      <AssetDirectory />
    </div>
  );
}
