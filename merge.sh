#!/bin/bash

#clean
rm -rf $1_list.txt
#Creage file with list of files to concatenate
for f in ./downloads/*.ts; do echo "file '$f'" >> $1_list.txt; done
#concatanete them
ffmpeg -f concat -safe 0 -i $1_list.txt -c copy $1_output.ts
#convert to mp3
ffmpeg -i $1_output.ts $2.mp3
#clean up
rm -rf $1_output.ts
