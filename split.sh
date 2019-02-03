#!/bin/bash
#./split.sh fileName.mp3 destinationFolder/prefix 300
ffmpeg -i $1 -f segment -segment_time $3 -c copy $2%03d.mp3