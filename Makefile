.PHONY: run-python run-cpp

run-python:
	# usage: make run-python FILE=ns-3/sim-*.py
	if [ -z "$(FILE)" ]; then echo "Provide FILE variable, e.g., make run-python FILE=ns-3/sim-1768229256366.py"; exit 1; fi
	bash tools/run_python_sim.sh "$(FILE)"

run-cpp:
	# usage: make run-cpp FILE=ns-3/scratch/sim-*.cc NS3_DIR=/path/to/ns-3
	if [ -z "$(FILE)" ]; then echo "Provide FILE variable, e.g., make run-cpp FILE=ns-3/scratch/sim-1768228681778.cc NS3_DIR=/path/to/ns-3"; exit 1; fi
	if [ -z "$(NS3_DIR)" ]; then echo "Provide NS3_DIR variable, e.g., NS3_DIR=/home/user/ns-3"; exit 1; fi
	bash tools/run_cpp_sim.sh "$(FILE)"
