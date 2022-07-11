import React, { SyntheticEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { connect, useDispatch } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";

import MailChimPopUp from "../../components/MailChimpPopUp";

import { getAllProgramsInformation, searchPrograms } from "./Actions";

import { RootReducerInterface } from "../../reducers";
import { ProgramsStateInterface } from "./Reducer";

import Card from "./Card/Card";
import EmptyCard from "./EmptyCard/EmptyCard";

import styles from "./Programs.module.scss";
import Thumbnail from "./Thumbnail/Thumbnail";
import FiltersPopUp from "../../components/FiltersPopUp";
import Button from "../../components/Button/Button";

const SpecificProgramWrapper = styled.div<{ isShowing: boolean }>`
  max-height: 80vh;
  padding: 0 2vw;
  width: 65%;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  position: relative;

  @media screen and (max-width: 768px) {
    display: ${(props) => !props.isShowing && "none"};
    position: fixed;
    top: 10vh;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    z-index: 1200;
    max-height: 90vh;
    overflow-y: auto;

    &:before {
      content: " ";
      position: fixed;
      background-color: rgba(0, 0, 0, 0.8);
      inset: 0;
    }
  }
`;

const CardWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Caret = styled.button`
  display: none;
  background-color: transparent;
  outline: none;
  border: none;
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    color: black;
    right: 5%;
    top: 2%;
    z-index: 1000;
  }
`;

type ProgramsProps = ProgramsStateInterface & {
  getAllProgramsInformationAction(): void;
};

const Programs = ({
  getAllProgramsInformationAction,
  information,
  isLoadingPrograms,
  searchedInformation,
}: ProgramsProps) => {
  const dispatch = useDispatch();

  const [selectedProgramIndex, setSelectedProgramIndex] = useState(0);
  const [isShowingModalOnMobile, setIsShowingModalOnMobile] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupMail, setShowPopupMail] = useState(false);
  const [programSearchQuery, setProgramSearchQuery] = useState("");
  const handleUserSelection = (index: number) => {
    setSelectedProgramIndex(index);
    setIsShowingModalOnMobile(true);
  };

  const handleShowPopup = (option: boolean) => {
    setShowPopup(option);
  };

  const handleShowPopupMail = (option: boolean) => {
       setShowPopupMail(option);}

  const handleSearch = () => {
    dispatch(
      searchPrograms(
        information.filter(
          (programs) =>
            programs.programName
              .toLowerCase()
              .includes(programSearchQuery.toLowerCase()) ||
            programs.description
              .toLowerCase()
              .includes(programSearchQuery.toLowerCase()) ||
            programs.keyFacts
              .join(",")
              .toLowerCase()
              .includes(programSearchQuery.toLowerCase()) ||
            programs.locations
              .join(",")
              .toLowerCase()
              .includes(programSearchQuery.toLowerCase()) ||
            programs.careerType
              .join(",")
              .toLowerCase()
              .includes(programSearchQuery.toLowerCase())
        )
      )
    );
    setProgramSearchQuery("");
  };

  useEffect(() => {
    getAllProgramsInformationAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.content}>
      <div className={styles["title__wrapper"]}>
        <h1 className={styles.title}>
          Opportunities for Refugees. We believe that talent is evenly
          distributed but opportunity is not!{" "}
        </h1>
        <p>
          Chatterbox Talent aims to connect marginalised talent with employment,
          self employment and employability schemes across the UK. We want to
          throw open the doors for refugees and this is just the start 🚀{" "}
        </p>
      </div>
      <section className={styles["content__wrapper"]}>
        <div className={styles["all-programs__wrapper"]}>
          {isLoadingPrograms ? (
            <div className={styles.loadingWrapper}>
              <ClipLoader
                color={styles["green-main"]}
                loading={isLoadingPrograms}
              />
            </div>
          ) : (
            <div className={styles["thumbnails__wrapper"]}>
              <div className={styles["thumbnail__sticky"]}>

                <EmptyCard handleShowPopup={handleShowPopupMail}/>

               
                <div className={styles.search}>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={programSearchQuery}
                    onChange={(e) => setProgramSearchQuery(e.target.value)}
                  />
                  <button
                    className={styles.searchButton}
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                  <button
                    className={styles.searchButton}
                    onClick={() => dispatch(searchPrograms([]))}
                  >
                    Reset
                  </button>
                </div>

                <div className={styles["filters__wrapper"]}>
                  <div>
                    <label>Sort:</label>
                    <select className={styles["select__wrapper"]}>
                      <option>Top rating</option>
                      <option>Most recent</option>
                    </select>
                  </div>
                  <Button onClick={() => handleShowPopup(true)}>Filters</Button>
                </div>
              </div>
              {(searchedInformation.length > 0
                ? searchedInformation
                : information
              ).map((data, index) => {
                return (
                  <Thumbnail
                    key={index}
                    careerTypes={data.careerType}
                    index={index}
                    locations={data.locations}
                    title={data.programName}
                    onThumbnailSelection={handleUserSelection}
                    isSelected={index === selectedProgramIndex}
                    numberOfReviews={data.reviews.length}
                    programId={data.id}
                  />
                );
              })}
            </div>
          )}
        </div>
        {showPopupMail && (
          <MailChimPopUp
            onSuccess={() => handleShowPopupMail(false)}
            onClose={() => handleShowPopupMail(false)}
          />
        )}
        {showPopup && (
          <FiltersPopUp
            information={information}
            onSuccess={() => handleShowPopup(false)}
            onClose={() => handleShowPopup(false)}
          />
        )}
        <SpecificProgramWrapper
          isShowing={isShowingModalOnMobile}
          onClick={() => setIsShowingModalOnMobile(false)}
        >
          {isLoadingPrograms ? (
            <div className={styles.loadingWrapper}>
              <ClipLoader
                color={styles["green-main"]}
                loading={isLoadingPrograms}
              />
            </div>
          ) : (
            <CardWrapper
              onClick={(evt: SyntheticEvent) => evt.stopPropagation()}
            >
              <Card {...information[selectedProgramIndex]} />
              <Caret onClick={() => setIsShowingModalOnMobile(false)}>X</Caret>
            </CardWrapper>
          )}
        </SpecificProgramWrapper>
      </section>
    </div>
  );
};

const mapStateToProps = (state: RootReducerInterface) => ({
  information: state.ProgramsReducer.programs.information,
  isLoadingPrograms: state.ProgramsReducer.programs.isLoadingPrograms,
  searchedInformation: state.ProgramsReducer.programs.searchedInformation,
});

export default connect(mapStateToProps, {
  getAllProgramsInformationAction: getAllProgramsInformation,
})(Programs);
