file=$1
basedir="."

if [[ -z "${npm_package_version}" || -z "${file}" || ! $file =~ .(ts|tsx|js)$ ]]; then
	# The script should be run through npm and not directly.
	echo "usage: npm run migrate-file -- path/to/file.js"
	exit 1
fi

# Some issues were encountered with ts-migrate with higher versions of TypeScript
# Before updating, let's check that the script works as expected
typescript_version=$(tsc -v)
if [ "$typescript_version" != "Version 4.2.4" ]; then
	echo "Expecting TypeScript Version 4.2.4 but found ${typescript_version}"
 	exit 1
fi

# remove b4 from file path just incase
file=${file#b4/}

if [ -f "$file" ]; then
		# Check for uncommited changes on file in question

		# Rename file to ts/tsx & commit the changes
		ts-migrate rename $basedir -s $file
		git add "$basedir/${file%.*}.*"
		git commit -m "[TypeScript] Rename js file to ts/tsx"
else 
    echo "$file does not exist."
fi

# Make automatic changes to the file
ts-migrate migrate $basedir \
	--sources="${file%.*}.{ts,tsx}" \
	--sources="node_modules/**/*.d.ts" \
	--sources="@types/**/*.d.ts"

