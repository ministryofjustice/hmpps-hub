#Server side storage copy
#https://stackoverflow.com/questions/31743848/how-to-copy-all-containers-along-with-blobs-from-one-azure-storage-account-to-ot
$SourceStorageAccount = "sourcestorageaccount_name"
$SourceStorageKey = "sourcestorageaccount_key1"
$DestStorageAccount = "targestorageaccount_name"
$DestStorageKey = "targetstorageaccount_key1"
$SourceStorageContext = New-AzureStorageContext -StorageAccountName $SourceStorageAccount -StorageAccountKey $SourceStorageKey
$DestStorageContext = New-AzureStorageContext -StorageAccountName $DestStorageAccount -StorageAccountKey $DestStorageKey

$Containers = Get-AzureStorageContainer -Context $SourceStorageContext

foreach($Container in $Containers)
{
    $ContainerName = $Container.Name
    if (!((Get-AzureStorageContainer -Context $DestStorageContext) | Where-Object { $_.Name -eq $ContainerName }))
    {   
        Write-Output "Creating new container $ContainerName"
        New-AzureStorageContainer -Name $ContainerName -Permission Off -Context $DestStorageContext -ErrorAction Stop
    }

    $Blobs = Get-AzureStorageBlob -Context $SourceStorageContext -Container $ContainerName
    $BlobCpyAry = @() #Create array of objects

    #Do the copy of everything
    foreach ($Blob in $Blobs)
    {
       $BlobName = $Blob.Name
       Write-Output "Copying $BlobName from $ContainerName"
       $BlobCopy = Start-AzureStorageBlobCopy -Context $SourceStorageContext -SrcContainer $ContainerName -SrcBlob $BlobName -DestContext $DestStorageContext -DestContainer $ContainerName -DestBlob $BlobName
       $BlobCpyAry += $BlobCopy
    }

    #Check Status
    foreach ($BlobCopy in $BlobCpyAry)
    {
       #Could ignore all rest and just run $BlobCopy | Get-AzureStorageBlobCopyState but I prefer output with % copied
       $CopyState = $BlobCopy | Get-AzureStorageBlobCopyState
       $Message = $CopyState.Source.AbsolutePath + " " + $CopyState.Status + " {0:N2}%" -f (($CopyState.BytesCopied/$CopyState.TotalBytes)*100) 
       Write-Output $Message
    }
}