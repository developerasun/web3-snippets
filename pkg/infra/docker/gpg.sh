gpg -a --export --output ./pub.asc nellow1102@gmail.com
gpg -a --export-secret-keys > ./pk.asc

exportAsHexMessage() {
    gpg --encrypt --recipient <recipient_name> --armor <file_name>
}

noPasspharse() {
    gpg --edit-keys <key_name>
    passwd # blank and enter
}